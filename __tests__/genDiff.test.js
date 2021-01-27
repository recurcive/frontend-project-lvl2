import { test, expect } from '@jest/globals';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import genDiff from '../src/diff';
import stylish from '../src/formatters/stylish.js';
import plain from '../src/formatters/plain.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('check json', () => {
  const result = fs.readFileSync(getFixturePath('result_json.txt'), 'utf8');
  expect(genDiff(getFixturePath('simple_file1.json'), getFixturePath('simple_file2.json'), stylish)).toBe(result);
});

test('check yaml', () => {
  const result = fs.readFileSync(getFixturePath('result_json.txt'), 'utf8');
  expect(genDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'), stylish)).toBe(result);
});

test('check nested json', () => {
  const result = fs.readFileSync(getFixturePath('nested_result_json.txt'), 'utf8');
  expect(genDiff(getFixturePath('nested_file1.json'), getFixturePath('nested_file2.json'), stylish)).toBe(result);
});

test('check nested yaml', () => {
  const result = fs.readFileSync(getFixturePath('nested_result_json.txt'), 'utf8');
  expect(genDiff(getFixturePath('nested_file1.yml'), getFixturePath('nested_file2.yml'), stylish)).toBe(result);
});

test('check plain formatter', () => {
  const result = fs.readFileSync(getFixturePath('plane_result.txt'), 'utf8');
  expect(genDiff(getFixturePath('nested_file1.yml'), getFixturePath('nested_file2.yml'), plain)).toBe(result);
});
