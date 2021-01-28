import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import * as yaml from 'js-yaml';
import getFormatter from './formatters/index.js';

const getFileContent = (fileName) => fs.readFileSync(fileName, 'utf8');

const getObject = (extName, content) => {
  if (extName === '.json') {
    return JSON.parse(content);
  }
  if (_.includes(['.yaml', '.yml'], extName)) {
    return yaml.load(content);
  }
  throw new Error(`Неизвестный формат файлов: '${extName}'! Разрешены только следующие форматы: json, yaml`);
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

const genDiff = (firstFile, secondFile, format) => {
  const extName = path.extname(firstFile);
  const object1 = getObject(extName, getFileContent(firstFile));
  const object2 = getObject(extName, getFileContent(secondFile));

  const diff = generateAst(object1, object2);

  return getFormatter(format)(diff);
};

export default genDiff;
