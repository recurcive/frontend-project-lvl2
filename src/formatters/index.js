import stylish from './stylish.js';
import plain from './plain.js';

const getFormatter = (formatName) => {
  if (formatName === 'stylish') {
    return stylish;
  }
  if (formatName === 'plain') {
    return plain;
  }
  return new Error(`unknown format type ${formatName}`);
};

export default getFormatter;
