import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import * as yaml from 'js-yaml';

const space = 4;

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

const sign = {
  DELETED: '- ',
  EQUAL: '  ',
  CHANGED: '',
  ADDED: '+ ',
  NESTED: '',
};

export const generateAst = (keys, object1, object2, depth = 1) => keys.flatMap((key) => {
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
    return [
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
    ];
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

const spaceCounter = (depth, token = '') => ' '.repeat(depth * space - token.length);

const renderValue = (value, depth) => {
  if (_.isArray(value)) {
    return value.map((val) => renderValue(val)).join('\n');
  }
  if (_.isObject(value)) {
    const entries = Object.entries(value);
    const nestedDepth = depth + 1;
    const values = entries.map(([key, val]) => {
      if (_.isObject(val)) {
        return `${spaceCounter(nestedDepth)}${key}: ${renderValue(val, depth + 1)}`;
      }
      return `${spaceCounter(nestedDepth)}${key}: ${val}`;
    });

    return `{\n${values.join('\n')}\n${spaceCounter(depth)}}`;
  }
  return value;
};

export const stylish = (ast) => {
  const jsonFormatter = (nested) => nested.map((node) => {
    if (node.node === 'NESTED') {
      return `${spaceCounter(node.depth)}${node.key}: {\n${renderValue(
        jsonFormatter(node.children),
      )}\n${spaceCounter(node.depth)}}`;
    }
    return `${spaceCounter(node.depth, sign[node.node])}${sign[node.node]}${
      node.key
    }: ${renderValue(node.value, node.depth)}`;
  });

  return `{\n${jsonFormatter(ast).join('\n')}\n}`;
};

const genDiff = (firstFile, secondFile) => {
  const extName = path.extname(firstFile);
  const object1 = getObject(extName, getFileContent(firstFile));

  const object2 = getObject(extName, getFileContent(secondFile));

  const keys = getSortedKeys(object1, object2).sort();

  const nestedDiff = generateAst(keys, object1, object2);

  return stylish(nestedDiff);
};

export default genDiff;
