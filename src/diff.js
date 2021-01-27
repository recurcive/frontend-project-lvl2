import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import * as yaml from 'js-yaml';

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

export const getSortedKeys = (json1, json2) => _.union(_.keys(json1), _.keys(json2)).sort();

export const generateAst = (keys, object1, object2, depth = 1) => keys.map((key) => {
  if (_.has(object1, key) && _.has(object2, key)) {
    if (object1[key] === object2[key]) {
      return {
        node: 'EQUAL',
        key,
        value: object1[key],
        depth,
      };
    }
    if (_.isObject(object1[key]) && _.isObject(object2[key])) {
      return {
        node: 'NESTED',
        key,
        depth,
        children: generateAst(
          getSortedKeys(object1[key], object2[key]),
          object1[key],
          object2[key],
          depth + 1,
        ),
      };
    }
    /*    return [
      {
        node: 'DELETED',
        key,
        value: object1[key],
        depth,
      },
      {
        node: 'ADDED',
        key,
        value: object2[key],
        depth,
      },
    ]; */
    return {
      node: 'UPDATED',
      key,
      valueOld: object1[key],
      valueNew: object2[key],
      depth,
    };
  }
  if (_.has(object1, key) && !_.has(object2, key)) {
    return {
      node: 'DELETED',
      key,
      value: object1[key],
      depth,
    };
  }
  return {
    node: 'ADDED',
    key,
    value: object2[key],
    depth,
  };
});

const genDiff = (firstFile, secondFile, format) => {
  const extName = path.extname(firstFile);
  const object1 = getObject(extName, getFileContent(firstFile));

  const object2 = getObject(extName, getFileContent(secondFile));

  const keys = getSortedKeys(object1, object2).sort();

  const diff = generateAst(keys, object1, object2);

  return format(diff);
};

export default genDiff;
