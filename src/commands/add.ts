import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';
import { parseGitHubUrl, shallowCloneRepo, getSkillsInDir, findSkillDirectory } from '../utils/git';
import { getTempDir } from '../utils/paths';
import { CLIType } from '../types';

const execAsync = promisify(require('child_process').exec);

export const addCommand = new Command('add')
  .description('Add a skill from GitHub')
  .argument('<path>', 'GitHub URL or owner/repo/path')
  .option('-c, --cli <type>', 'Target CLI (claude, codex, gemini)')
  .option('-y, --yes', 'Skip confirmation')
  .action(async (skillPathArg: string, options) => {
    try {
      // Parse GitHub URL
      let repoUrl: string;
      let gitPath: string;

      if (skillPathArg.includes('github.com')) {
        const parsed = parseGitHubUrl(skillPathArg);
        repoUrl = `https://github.com/${parsed.owner}/${parsed.repo}.git`;
        gitPath = parsed.path;
      } else {
        // Assume it's owner/repo/path format
        const parts = skillPathArg.split('/');
        if (parts.length < 2) {
          console.error(chalk.red('Invalid path format. Use owner/repo/path or full GitHub URL'));
          process.exit(1);
        }
        repoUrl = `https://github.com/${parts[0]}/${parts[1]}.git`;
        gitPath = parts.slice(2).join('/');
      }

      const spinner = ora('Cloning repository...').start();

      // Clone repository
      const tempDir = path.join(getTempDir(), Date.now().toString());
      await fs.ensureDir(getTempDir());

      try {
        await shallowCloneRepo(repoUrl, tempDir);
        spinner.succeed('Repository cloned successfully');
      } catch (error: any) {
        spinner.fail('Failed to clone repository');
        console.error(chalk.red(error.message));
        process.exit(1);
      }

      // Find skill(s) to install
      spinner.start('Finding skills...');

      let skillsToInstall: string[] = [];

      if (gitPath) {
        // Specific path provided
        const targetPath = path.join(tempDir, gitPath);
        if (await fs.pathExists(targetPath)) {
          const skillDir = await findSkillDirectory(targetPath);
          if (skillDir) {
            skillsToInstall.push(skillDir);
          } else {
            spinner.fail('No valid skill found at specified path');
            process.exit(1);
          }
        } else {
          spinner.fail('Specified path does not exist in repository');
          process.exit(1);
        }
      } else {
        // No specific path, find all skills
        const allSkills = await getSkillsInDir(tempDir);
        if (allSkills.length === 0) {
          spinner.fail('No skills found in repository');
          process.exit(1);
        }

        if (allSkills.length === 1) {
          skillsToInstall.push(allSkills[0]);
        } else {
          spinner.stop();
          const { selectedSkills } = await inquirer.prompt([
            {
              type: 'checkbox',
              name: 'selectedSkills',
              message: 'Select skills to install:',
              choices: allSkills.map(s => ({
                name: path.basename(s),
                value: s,
              })),
            },
          ]);

          if (selectedSkills.length === 0) {
            console.log(chalk.yellow('No skills selected'));
            process.exit(0);
          }

          skillsToInstall = selectedSkills;
        }
      }

      spinner.succeed(`Found ${skillsToInstall.length} skill(s)`);

      // Select target CLI(s)
      let cliTargets: CLIType[] = [];

      if (options.cli) {
        cliTargets = [options.cli as CLIType];
      } else {
        const { selectedCli } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selectedCli',
            message: 'Select target CLI(s):',
            choices: [
              { name: 'Claude Code', value: 'claude' },
              { name: 'Codex CLI', value: 'codex' },
              { name: 'Gemini CLI', value: 'gemini' },
            ],
            default: ['claude'],
          },
        ]);

        if (selectedCli.length === 0) {
          console.log(chalk.yellow('No CLI selected'));
          process.exit(0);
        }

        cliTargets = selectedCli;
      }

      // Install skills
      for (const skillPath of skillsToInstall) {
        const skillName = path.basename(skillPath);
        console.log(`\n${chalk.bold('Installing:')} ${skillName}`);

        for (const cli of cliTargets) {
          const installSpinner = ora(`Installing to ${cli}...`).start();

          try {
            // Use Python backend to install
            const pythonScript = path.join(__dirname, '../../python/skills_router/core.py');

            const installResult = await execAsync(
              `python3 ${pythonScript} install '${JSON.stringify({
                sourcePath: skillPath,
                targetCli: cli,
              })}'`
            );

            const result = JSON.parse(installResult.stdout);

            if (result.success) {
              installSpinner.succeed(`Installed to ${cli}`);
            } else {
              installSpinner.fail(`Failed to install to ${cli}: ${result.error}`);
            }
          } catch (error: any) {
            installSpinner.fail(`Failed to install to ${cli}: ${error.message}`);
          }
        }
      }

      // Cleanup
      spinner.start('Cleaning up...');
      await fs.remove(tempDir);
      spinner.succeed('Cleanup complete');

      console.log(chalk.green('\n✓ All operations completed successfully!'));

    } catch (error: any) {
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });
