import fs from 'fs';
import _ from "lodash";

const getFileContent = fileName => fs.readFileSync(fileName,  'utf8');

const getObject = content => JSON.parse(content);

const getKeys = (json1, json2) => _.union(_.keys(json1), _.keys(json2));

const calculateDiff = (keys, object1, object2) => {
    return keys.map(key => {

        if (object1.hasOwnProperty(key) && !object2.hasOwnProperty(key)) {
            return `  - ${key}: ${object1[key]}`;
        }
        if (!object1.hasOwnProperty(key) && object2.hasOwnProperty(key)) {
            return `  + ${key}: ${object2[key]}`;
        }
        if (object1[key] === object2[key]) {
            return `    ${key}: ${object1[key]}`;
        }
        if (object1[key] !== object2[key]) {
            return `  - ${key}: ${object1[key]}\n  + ${key}: ${object2[key]}`;
        }
    })
};

const genDiff = (firstFile, secondFile) => {
    const object1 = getObject(getFileContent(firstFile));
    const object2 = getObject(getFileContent(secondFile));

    const keys = getKeys(object1, object2).sort();

    const diff = calculateDiff(keys, object1, object2);

    const result = diff.reduce((arr, cur) => arr + '\n' + cur , '');

    return `{${result}\n}`;
};

export default genDiff;

