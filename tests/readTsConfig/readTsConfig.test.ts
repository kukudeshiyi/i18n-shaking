import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { readTsConfig } from '../../src/io';
import path from 'path';

test('tsconfig 存在', async () => {
  const content = await readTsConfig(
    path.join(__dirname, './__fixtures__/tsconfig.json')
  );
  assert.not.equal(content, undefined);
});

test('tsconfig 格式错误', async () => {
  const content = await readTsConfig(
    path.join(__dirname, './__fixtures__/tsconfigFormatError.json')
  );
  assert.equal(JSON.stringify(content), JSON.stringify({}));
});

test('tsconfig 不存在', async () => {
  const content = await readTsConfig(
    path.join(__dirname, './__fixtures__/notExist.json')
  );
  assert.equal(JSON.stringify(content), JSON.stringify({}));
});

test.run();
