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

const getKeys = (json1, json2) => _.union(_.keys(json1), _.keys(json2));

const calculateDiff = (keys, object1, object2) => keys.map((key) => {
  if (_.has(object1, key) && !_.has(object2, key)) {
    return `  - ${key}: ${object1[key]}`;
  }
  if (!_.has(object1, key) && _.has(object2, key)) {
    return `  + ${key}: ${object2[key]}`;
  }
  if (object1[key] === object2[key]) {
    return `    ${key}: ${object1[key]}`;
  }
  return `  - ${key}: ${object1[key]}\n  + ${key}: ${object2[key]}`;
});

const genDiff = (firstFile, secondFile) => {
  const extName = path.extname(firstFile);
  const object1 = getObject(extName, getFileContent(firstFile));
  const object2 = getObject(extName, getFileContent(secondFile));

  const keys = getKeys(object1, object2).sort();

  const diff = calculateDiff(keys, object1, object2);

  const result = diff.reduce((arr, cur) => `${arr}\n${cur}`, '');

  return `{${result}\n}`;
};

export default genDiff;
