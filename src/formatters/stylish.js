import _ from 'lodash';

const space = 4;

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

const sign = {
  DELETED: '- ',
  EQUAL: '  ',
  ADDED: '+ ',
};

const stylish = (ast) => {
  const jsonFormatter = (nested) => nested.map((node) => {
    if (node.node === 'NESTED') {
      return `${spaceCounter(node.depth)}${node.key}: {\n${renderValue(
        jsonFormatter(node.children),
      )}\n${spaceCounter(node.depth)}}`;
    }
    if (node.node === 'UPDATED') {
      return `${spaceCounter(node.depth, sign.DELETED)}${sign.DELETED}${node.key}: ${renderValue(node.valueOld, node.depth)}\n${spaceCounter(node.depth, sign.ADDED)}${sign.ADDED}${node.key}: ${renderValue(node.valueNew, node.depth)}`;
    }
    return `${spaceCounter(node.depth, sign[node.node])}${sign[node.node]}${node.key}: ${renderValue(node.value, node.depth)}`;
  });

  return `{\n${jsonFormatter(ast).join('\n')}\n}`;
};

export default stylish;
