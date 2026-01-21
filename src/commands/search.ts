import { Command } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  repository: string;
  author: string;
  stars: number;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
}

export const searchCommand = new Command('search')
  .description('Search for skills')
  .argument('<keyword>', 'Search keyword')
  .action(async (keyword: string) => {
    const spinner = ora('Searching skills...').start();

    try {
      const response = await axios.get<SearchResponse>(
        'https://www.skills-router.com/api/skills',
        {
          params: {
            page: 1,
            pageSize: 12,
            filter: keyword,
          },
        }
      );

      const data = response.data;

      // Check if response has expected structure
      if (!data || typeof data !== 'object') {
        spinner.fail('Invalid API response');
        console.error(chalk.red('\nThe API returned an invalid response format.'));
        process.exit(1);
      }

      const total = data.total || 0;
      const results = data.results || [];
      const page = data.page || 1;
      const pageSize = data.pageSize || 12;

      spinner.succeed(`Found ${total} skill(s)`);

      if (results.length === 0) {
        console.log(chalk.yellow('\nNo skills found matching your search.'));
        console.log(chalk.gray('\nNote: The search API is currently under development.'));
        console.log(chalk.gray('Please use the "add" command directly with GitHub URLs.'));
        return;
      }

      console.log(`\n${chalk.bold('Search Results:')} ${keyword}\n`);

      results.forEach((skill, index) => {
        console.log(`${chalk.cyan(`${index + 1}. ${skill.name}`)}`);
        console.log(`   ${skill.description}`);
        console.log(`   ${chalk.gray(`Repository: ${skill.repository}`)}`);
        console.log(`   ${chalk.gray(`Author: ${skill.author} | ⭐ ${skill.stars}`)}`);
        console.log();
      });

      console.log(chalk.gray(`Page ${page} of ${Math.ceil(total / pageSize)}`));

    } catch (error: any) {
      spinner.fail('Search failed');

      if (error.response) {
        console.error(chalk.red(`\nAPI Error: ${error.response.status} - ${error.response.statusText}`));
        console.error(chalk.gray('\nNote: The search API is currently under development.'));
        console.error(chalk.gray('Please use the "add" command directly with GitHub URLs.'));
      } else if (error.request) {
        console.error(chalk.red('\nNetwork error: Could not reach the API'));
        console.error(chalk.gray('\nNote: The search API is currently under development.'));
      } else {
        console.error(chalk.red(`\nError: ${error.message}`));
      }

      process.exit(1);
    }
  });
