import i18nShaking from '../../src/index';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from 'typescript';

test('alias string tranlation should be scan', async () => {
  const { handleResults, errors } = i18nShaking(
    ['tests/alias/__fixtures__/input.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(handleResults), JSON.stringify(['hello']));
  assert.equal(JSON.stringify(errors), '[]');
});
test('alias default string tranlation should be scan', async () => {
  const { handleResults, errors } = i18nShaking(
    ['tests/alias/__fixtures__/default.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(handleResults), JSON.stringify(['hello']));
  assert.equal(JSON.stringify(errors), '[]');
});

test.run();
