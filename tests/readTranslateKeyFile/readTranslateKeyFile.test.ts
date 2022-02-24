import { readTranslateKeyFile } from '../../src/io';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { join } from 'path';
import { CONFIG_PARAMS } from '../../src/constants';
import { ConfigParams } from '../../src/types';

test('readTranslateKeyFile', async () => {
  const result = await readTranslateKeyFile({
    [CONFIG_PARAMS.TRANSLATE_FILE_NAMES]: [
      join(__dirname, './__fixtures__/translateFileDirectory/en.json'),
      join(__dirname, './__fixtures__/translateFileDirectory/other.json'),
    ],
  } as ConfigParams);
  assert.equal(
    JSON.stringify(result),
    JSON.stringify([
      {
        key1: 'value1',
      },
      {
        key1: 'value2',
      },
    ])
  );
});

test.run();
