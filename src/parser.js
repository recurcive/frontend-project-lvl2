import fs from 'fs';
import _ from 'lodash';
import * as yamlParser from 'js-yaml';
import path from 'path';

export const getFormat = (filePath) => _.trimStart(path.extname(filePath), '.');

export const getFileContent = (filePath) => {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(resolvedPath, 'utf8');
};

export const getObject = (format, content) => {
  const parsers = {
    json: JSON.parse,
    yml: yamlParser.load,
    yaml: yamlParser.load,
  };

  const parser = parsers[format];

  if (parser) {
    return parser(content);
  }

  throw new Error(`Неизвестный формат файлов: '${format}'! Разрешены только следующие форматы: json, yaml`);
};
