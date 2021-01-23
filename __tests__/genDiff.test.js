import { test, expect } from '@jest/globals';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import genDiff from '../src';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('check json', () => {
  const result = fs.readFileSync(getFixturePath('result_json.txt'), 'utf8');
  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toBe(result);
});
