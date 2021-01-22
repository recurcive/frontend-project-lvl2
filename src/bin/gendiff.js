#!/usr/bin/env node

import program from 'commander';
import genDiff from '../index';

program
  .version('1.0.0')
  .arguments('<firstFile> <secondFile>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .action((firstFile, secondFile) => console.log(genDiff(firstFile, secondFile)))
  .parse(process.argv);

if (!program.args.length) program.help();
