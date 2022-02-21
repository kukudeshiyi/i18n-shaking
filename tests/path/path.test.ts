import { test } from 'uvu';
import path from 'path';
import * as assert from 'uvu/assert';
import { isValidPath } from '../../src/utils/path';
import { CONFIG_FILE_NAME } from '../../src/constants';

// utils
test('the absolute path to the existing file', async () => {
  const result = await isValidPath(
    path.join(__dirname, `./__fixtures__/${CONFIG_FILE_NAME}`)
  );
  assert.equal(result, true);
});

test("the absolute path to file that doesn't exist", async () => {
  const result = await isValidPath(
    path.join(__dirname, `./__fixtures__/notExistFile${Date.now()}.json`)
  );
  assert.equal(result, false);
});

test('the absolute path to the folder that exists', async () => {
  const result = await isValidPath(
    path.join(__dirname, `./__fixtures__/testDirectory`)
  );
  assert.equal(result, true);
});

test("the absolute path to the folder that doesn't exists", async () => {
  const result = await isValidPath(
    path.join(__dirname, `./__fixtures__/testDirectory${Date.now()}`)
  );
  assert.equal(result, false);
});

test.run();
