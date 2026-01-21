#!/usr/bin/env node
import { Command } from 'commander';
import { addCommand } from './commands/add';
import { searchCommand } from './commands/search';
import { listCommand } from './commands/list';
import { removeCommand } from './commands/remove';

const program = new Command();

program
  .name('skills-router')
  .description('A unified CLI tool to manage skills for different AI CLI tools')
  .version('0.1.0');

program.addCommand(addCommand);
program.addCommand(searchCommand);
program.addCommand(listCommand);
program.addCommand(removeCommand);

program.parse(process.argv);
