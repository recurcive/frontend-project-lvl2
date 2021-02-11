import formatter from './formatters/index.js';
import {
  generateAst, getFileContent, getFormat, getObject,
} from './utils/utils.js';

const genDiff = (firstFilePath, secondFilePath, format) => {
  const extName = getFormat(firstFilePath);

  const firstFileContent = getFileContent(firstFilePath);
  const secondFileContent = getFileContent(secondFilePath);

  const object1 = getObject(extName, firstFileContent);
  const object2 = getObject(extName, secondFileContent);

  const ast = generateAst(object1, object2);

  return formatter(format, ast);
};

export default genDiff;
