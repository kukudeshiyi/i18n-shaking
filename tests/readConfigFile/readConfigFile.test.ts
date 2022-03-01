import { readConfigFile } from '../../src/io';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { join } from 'path';
import { case1Data } from './__fixtures__/cases';

test('read config file success', async () => {
  const result = await readConfigFile(
    join(__dirname, './__fixtures__/i18nShaking.success.config.json')
  );
  assert.equal(result?.entry, case1Data.entry);
  assert.equal(result?.output, case1Data.output);
});

test('read config file failed', async () => {
  const result = await readConfigFile(
    join(__dirname, './__fixtures__/i18nShaking.failed.config.json')
  );
  assert.equal(result || '', '');
});

test.run();
