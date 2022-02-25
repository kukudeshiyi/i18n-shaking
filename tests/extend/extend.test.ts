import { i18nShakingForTest as i18nShaking } from '../../src/index';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from 'typescript';

test('重命名应该能正确识别', async () => {
  const { results, warnings, fits } = await i18nShaking(
    ['tests/extend/__fixtures__/single.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['i18n', 't']));
  assert.equal(JSON.stringify(results), JSON.stringify(['helloworld']));
});

test('解构应该要能正确识别(函数调用)', async () => {
  const { results, warnings, fits } = await i18nShaking(
    ['tests/extend/__fixtures__/func.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['useTranslation', 't']));
  assert.equal(JSON.stringify(results), JSON.stringify(['hello']));
});
test('解构应该要能正确识别(对象)', async () => {
  const { results, warnings, fits } = await i18nShaking(
    ['tests/extend/__fixtures__/identier.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['useTranslation', 't']));
  assert.equal(JSON.stringify(results), JSON.stringify(['hello']));
});

test.run();
