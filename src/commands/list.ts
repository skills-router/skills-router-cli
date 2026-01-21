import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { runPythonScript } from '../python';

export const listCommand = new Command('list')
  .description('List installed skills')
  .option('-c, --cli <type>', 'CLI type (claude, codex, gemini)', 'claude')
  .action(async (options) => {
    const spinner = ora(`Loading skills for ${options.cli}...`).start();

    try {
      const result = await runPythonScript<string[]>('list', { cliType: options.cli });

      if (!result.success) {
        spinner.fail('Failed to load skills');
        console.error(chalk.red(result.error || 'Unknown error'));
        process.exit(1);
      }

      spinner.succeed(`Skills loaded for ${options.cli}`);

      const skills = result.data || [];

      console.log(`\n${chalk.bold(`Installed Skills (${options.cli}):`)}\n`);

      if (skills.length === 0) {
        console.log(chalk.yellow('  No skills installed.'));
      } else {
        skills.forEach((skill: any, index: number) => {
          console.log(`  ${index + 1}. ${chalk.cyan(skill.name)}`);
          console.log(`     ${chalk.gray(skill.path)}`);
        });
      }

      console.log(`\nTotal: ${skills.length} skill(s)`);

    } catch (error: any) {
      spinner.fail('Failed to load skills');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });
