import formatter from './formatters/index.js';
import { getFileContent, getFormat, getObject } from './parser.js';
import generateAst from './generator.js';

const genDiff = (firstFilePath, secondFilePath, format) => {
  const format1 = getFormat(firstFilePath);
  const format2 = getFormat(secondFilePath);

  const firstFileContent = getFileContent(firstFilePath);
  const secondFileContent = getFileContent(secondFilePath);

  const data1 = getObject(format1, firstFileContent);
  const data2 = getObject(format2, secondFileContent);

  const ast = generateAst(data1, data2);

  return formatter(format, ast);
};

export default genDiff;
