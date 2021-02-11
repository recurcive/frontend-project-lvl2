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

  if (parser !== undefined) {
    return parser(content);
  }

  throw new Error(`Неизвестный формат файлов: '${format}'! Разрешены только следующие форматы: json, yaml`);
};

export const getSortedKeys = (json1, json2) => _.sortBy(_.union(_.keys(json1), _.keys(json2)));

export const generateAst = (object1, object2) => {
  const iter = (keys, innerObject1, innerObject2, depth = 1) => keys.map((key) => {
    if (_.has(innerObject1, key) && _.has(innerObject2, key)) {
      if (innerObject1[key] === innerObject2[key]) {
        return {
          node: 'EQUAL',
          key,
          value: innerObject1[key],
          depth,
        };
      }
      if (_.isObject(innerObject1[key]) && _.isObject(innerObject2[key])) {
        return {
          node: 'NESTED',
          key,
          depth,
          children: iter(
            getSortedKeys(innerObject1[key], innerObject2[key]),
            innerObject1[key],
            innerObject2[key],
            depth + 1,
          ),
        };
      }
      return {
        node: 'UPDATED',
        key,
        valueOld: innerObject1[key],
        valueNew: innerObject2[key],
        depth,
      };
    }
    if (_.has(innerObject1, key) && !_.has(innerObject2, key)) {
      return {
        node: 'DELETED',
        key,
        value: innerObject1[key],
        depth,
      };
    }
    return {
      node: 'ADDED',
      key,
      value: innerObject2[key],
      depth,
    };
  });

  return iter(getSortedKeys(object1, object2), object1, object2);
};
