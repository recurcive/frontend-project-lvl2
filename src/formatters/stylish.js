import _ from 'lodash';

const space = 4;

const sign = {
  deleted: '- ',
  equal: '  ',
  added: '+ ',
};

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

const stylish = (ast) => {
  const stylishFormatter = (nested, depth) => nested.map((node) => {
    if (node.type === 'nested') {
      return `${spaceCounter(depth)}${node.key}: {\n${renderValue(
        stylishFormatter(node.children, depth + 1),
      )}\n${spaceCounter(depth)}}`;
    }
    if (node.type === 'updated') {
      return `${spaceCounter(depth, sign.deleted)}${sign.deleted}${node.key}: ${renderValue(node.valueOld, depth)}\n${spaceCounter(depth, sign.added)}${sign.added}${node.key}: ${renderValue(node.valueNew, depth)}`;
    }
    return `${spaceCounter(depth, sign[node.type])}${sign[node.type]}${node.key}: ${renderValue(node.value, depth)}`;
  });

  return `{\n${stylishFormatter(ast, 1).join('\n')}\n}`;
};

export default stylish;
