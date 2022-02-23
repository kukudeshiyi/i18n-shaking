import { filterTranslateKeyFile } from '../../src/filterTranslateKeyFile';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { case1 } from './__fixtures__/cases';

test('filterTranslateKeyFile', async () => {
  const case1Result = filterTranslateKeyFile(case1.param1, case1.param2);
  assert.equal(case1Result, case1.expectResult);
});

test.run();
