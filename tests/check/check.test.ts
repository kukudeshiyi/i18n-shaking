import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { check } from '../../src/check';

test('各个文件输出Keys个数不一致', async () => {
  const checkStatus = check([{ key1: 1, key2: 2 }, { key1: 1 }]);
  assert.equal(checkStatus, false);
});

test('各个文件输出Keys个数一致', async () => {
  const checkStatus = check([
    { key1: 1, key2: 2 },
    { key1: 1, key2: 2 },
  ]);
  assert.equal(checkStatus, true);
});

test.run();
