import { i18nShaking } from '../../src/utilsfortest';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from 'typescript';

test('conditional expression tranlation should be scan', async () => {
  const { results, errors } = await i18nShaking(
    ['tests/conditionalExpression/__fixtures__/input.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(results), JSON.stringify(['hello', 'world']));
  assert.equal(JSON.stringify(errors), '[]');
});

test.run();
