import { i18nShakingForTest as i18nShaking } from '../../src/index';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from 'typescript';

test('conditional expression tranlation should be scan', async () => {
  const { results, warnings } = await i18nShaking(
    ['tests/conditionalExpression/__fixtures__/input.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(results), JSON.stringify(['hello', 'world']));
  assert.equal(JSON.stringify(warnings), '[]');
});

test.run();
