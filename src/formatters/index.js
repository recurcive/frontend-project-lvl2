import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatter = (format = 'stylish', data) => {
  const inner = {
    stylish: () => stylish(data),
    plain: () => plain(data),
    json: () => json(data),
  };

  const chosenFormatter = inner[format];
  return chosenFormatter !== undefined ? chosenFormatter(data) : new Error(`unknown format type ${format}`);
};

export default formatter;

/*
switch (formatName) {
    case 'stylish':
        return stylish;
    case 'plain':
        return plain;
    case 'json':
        return json;
    default:
        return stylish;
// return new Error(`unknown format type ${formatName}`); */
