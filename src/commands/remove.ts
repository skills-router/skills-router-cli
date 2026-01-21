import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { runPythonScript } from '../python';

export const removeCommand = new Command('remove')
  .description('Remove a skill')
  .argument('<name>', 'Skill name to remove')
  .option('-c, --cli <type>', 'CLI type (claude, codex, gemini)', 'claude')
  .option('-y, --yes', 'Skip confirmation')
  .action(async (name: string, options) => {
    try {
      // Confirm removal
      if (!options.yes) {
        const { confirmed } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmed',
            message: `Remove skill "${name}" from ${options.cli}?`,
            default: false,
          },
        ]);

        if (!confirmed) {
          console.log(chalk.yellow('Operation cancelled'));
          process.exit(0);
        }
      }

      const spinner = ora(`Removing skill "${name}" from ${options.cli}...`).start();

      const result = await runPythonScript('remove', {
        cliType: options.cli,
        skillName: name,
      });

      if (!result.success) {
        spinner.fail('Failed to remove skill');
        console.error(chalk.red(result.error || 'Unknown error'));
        process.exit(1);
      }

      spinner.succeed(result.message || 'Skill removed successfully');
      console.log(chalk.green('\n✓ Skill removed successfully!'));

    } catch (error: any) {
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });
