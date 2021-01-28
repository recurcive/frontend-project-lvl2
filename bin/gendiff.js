#!/usr/bin/env node

import program from 'commander';
import genDiff from '../index.js';

program
  .version('1.0.0')
  .arguments('<firstFile> <secondFile>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((firstFile, secondFile) => {
    console.log(genDiff(firstFile, secondFile, program.format));
  })
  .parse(process.argv);

if (!program.args.length) program.help();
