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
      spinner.succeed(`Found ${data.total} skill(s)`);

      if (data.results.length === 0) {
        console.log(chalk.yellow('\nNo skills found matching your search.'));
        return;
      }

      console.log(`\n${chalk.bold('Search Results:')} ${keyword}\n`);

      data.results.forEach((skill, index) => {
        console.log(`${chalk.cyan(`${index + 1}. ${skill.name}`)}`);
        console.log(`   ${skill.description}`);
        console.log(`   ${chalk.gray(`Repository: ${skill.repository}`)}`);
        console.log(`   ${chalk.gray(`Author: ${skill.author} | ⭐ ${skill.stars}`)}`);
        console.log();
      });

      console.log(chalk.gray(`Page ${data.page} of ${Math.ceil(data.total / data.pageSize)}`));

    } catch (error: any) {
      spinner.fail('Search failed');

      if (error.response) {
        console.error(chalk.red(`\nAPI Error: ${error.response.status} - ${error.response.statusText}`));
      } else if (error.request) {
        console.error(chalk.red('\nNetwork error: Could not reach the API'));
      } else {
        console.error(chalk.red(`\nError: ${error.message}`));
      }

      process.exit(1);
    }
  });
