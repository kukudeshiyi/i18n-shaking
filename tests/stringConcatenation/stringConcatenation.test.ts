import { i18nShakingForTest as i18nShaking } from '../../src/index';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from 'typescript';

test('string concatenation tranlation should be scan', async () => {
  const { results, errors } = await i18nShaking(
    ['tests/stringConcatenation/__fixtures__/single.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(results), JSON.stringify(['helloworld']));
  assert.equal(JSON.stringify(errors), '[]');
});

test('string concatenation tranlation should be scan', async () => {
  const { results, errors } = await i18nShaking(
    ['tests/stringConcatenation/__fixtures__/multi.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(results), JSON.stringify(['helloworldbrandon']));
  assert.equal(JSON.stringify(errors), '[]');
});

test.run();
