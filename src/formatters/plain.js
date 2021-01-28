import _ from 'lodash';

const textWrapper = (value) => (_.isString(value) ? `'${value}'` : value);

const printPlainValue = (value) => (_.isObject(value) ? '[complex value]' : textWrapper(value));

const plain = (ast) => {
  const plainFormatter = (nested, parentKey = []) => nested.flatMap((node) => {
    switch (node.node) {
      case 'NESTED':
        return plainFormatter(node.children, [...parentKey, node.key]);
      case 'ADDED':
        return `Property '${[...parentKey, node.key].join('.')}' was added with value: ${printPlainValue(node.value)}`;
      case 'DELETED':
        return `Property '${[...parentKey, node.key].join('.')}' was removed`;
      case 'UPDATED':
        return `Property '${[...parentKey, node.key].join('.')}' was updated. From ${printPlainValue(node.valueOld)} to ${printPlainValue(node.valueNew)}`;
      default:
        return [];
    }
  });

  return plainFormatter(ast).join('\n');
};

export default plain;
