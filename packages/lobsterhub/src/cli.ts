#!/usr/bin/env node

import { program } from 'commander'
import { install } from './commands/install.js'
import { list } from './commands/list.js'
import { search } from './commands/search.js'

program
  .name('lobsterhub')
  .description('CLI for LobsterHub - Install and manage Lobster workflows')
  .version('0.1.0')

program
  .command('install <slug>')
  .description('Install a workflow from LobsterHub')
  .option('-d, --dir <path>', 'Installation directory', '~/.clawdbot/lobster/workflows')
  .action(install)

program
  .command('list')
  .description('List installed workflows')
  .option('-d, --dir <path>', 'Workflows directory', '~/.clawdbot/lobster/workflows')
  .action(list)

program
  .command('search <query>')
  .description('Search for workflows on LobsterHub')
  .option('-l, --limit <number>', 'Maximum number of results', '10')
  .action(search)

program.parse()
