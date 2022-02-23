import { output } from '../../src/io';
import { test, suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
  TEST_OUTPUT_PATH,
  TEST_TRANSLATE_FILE_NAMES,
  case1,
} from './__fixtures__/cases';
import { ConfigParams } from '../../src/types/index';
import { rmdir, mkdir } from 'fs/promises';
import { isValidPath } from '../../src/utils';

let errorStatus = false;

test.before.each(async () => {
  try {
    await rmdir(TEST_OUTPUT_PATH, {
      recursive: true,
    });
    await mkdir(TEST_OUTPUT_PATH);
  } catch (e) {
    errorStatus = true;
  }
});

test('output successfully', async () => {
  if (errorStatus) {
    assert.equal(false, true, 'before hook failed');
    return;
  }
  const status = await output(case1.param1, case1.param2 as ConfigParams);
  const validateResults = await Promise.all(
    TEST_TRANSLATE_FILE_NAMES.map(async (path) => {
      return await isValidPath(path);
    })
  );
  assert.equal(status, true);
  assert.equal(validateResults, [true, true]);
});

test.run();
