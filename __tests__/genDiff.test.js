import fs from "fs";
import genDiff from "../src";


test('check json', () => {
    const result = fs.readFileSync('__tests__/fixtures/result_json.txt', 'utf8');
    expect(genDiff('__tests__/fixtures/file1.json', '__tests__/fixtures/file2.json')).toBe(result);
});
