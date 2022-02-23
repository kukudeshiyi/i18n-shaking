import { i18nShakingForTest as i18nShaking } from '../../src/index';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from 'typescript';

test('static string tranlation should be scan', async () => {
  const { results, warnings } = await i18nShaking(
    ['tests/static/__fixtures__/input.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(results), JSON.stringify(['hello']));
  assert.equal(JSON.stringify(warnings), '[]');
});

test.run();
