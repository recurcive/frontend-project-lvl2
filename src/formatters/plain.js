import _ from 'lodash';

const textWrapper = (value) => (_.isString(value) || _.isNumber(value) ? `'${value}'` : value);

const printPlainValue = (value) => (_.isObject(value) ? '[complex value]' : textWrapper(value));

const plain = (ast) => {
  const plainFormatter = (nested, parentKey = []) => nested.flatMap((node) => {
    if (node.node === 'NESTED') {
      return plainFormatter(node.children, [...parentKey, node.key]);
    }
    if (node.node === 'ADDED') {
      return `Property '${[...parentKey, node.key].join('.')}' was added with value: ${printPlainValue(node.value)}`;
    }
    if (node.node === 'DELETED') {
      return `Property '${[...parentKey, node.key].join('.')}' was removed`;
    }
    if (node.node === 'UPDATED') {
      return `Property '${[...parentKey, node.key].join('.')}' was updated. From ${printPlainValue(node.valueOld)} to ${printPlainValue(node.valueNew)}`;
    }
    return [];
  });

  return plainFormatter(ast).join('\n');
};

export default plain;
