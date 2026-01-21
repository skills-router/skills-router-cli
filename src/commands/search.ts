import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string | null;
  repo: string;
  path: string;
  version: string | null;
  star: number;
  fork: number;
  updateAt: string;
}

interface SearchResponse {
  data: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: string;
    totalPages: number;
  };
}

export const searchCommand = new Command('search')
  .description('Search for skills')
  .argument('<keyword>', 'Search keyword')
  .action(async (keyword: string) => {
    const spinner = ora('Searching skills...').start();

    try {
      // Build URL with query parameters directly
      const url = `https://www.skills-router.com/api/skills?q=${encodeURIComponent(keyword)}&page=1&limit=12`;

      // Use fetch instead of axios for better compatibility
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as SearchResponse;

      // Check if response has expected structure
      if (!data || typeof data !== 'object') {
        spinner.fail('Invalid API response');
        console.error(chalk.red('\nThe API returned an invalid response format.'));
        process.exit(1);
      }

      const total = parseInt(data.pagination?.total || '0', 10);
      const results = data.data || [];
      const page = data.pagination?.page || 1;
      const limit = data.pagination?.limit || 12;
      const totalPages = data.pagination?.totalPages || 1;

      spinner.succeed(`Found ${total} skill(s)`);

      if (results.length === 0) {
        console.log(chalk.yellow('\nNo skills found matching your search.'));
        return;
      }

      console.log(`\n${chalk.bold('Search Results:')} ${keyword}\n`);

      results.forEach((skill: SearchResult, index: number) => {
        console.log(`${chalk.cyan(`${index + 1}. ${skill.name}`)}`);
        console.log(`   ${skill.description}`);
        console.log(`   ${chalk.gray(`Repository: ${skill.repo}`)}`);
        console.log(`   ${chalk.gray(`Stars: ${skill.star} | Forks: ${skill.fork}`)}`);
        if (skill.version) {
          console.log(`   ${chalk.gray(`Version: ${skill.version}`)}`);
        }
        console.log();
      });

      console.log(chalk.gray(`Page ${page} of ${totalPages} (Total: ${total} skills)`));

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
