import { i18nShakingForTest as i18nShaking } from '../../src/index';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from 'typescript';

test('正确识别导出名', async () => {
  const { results, fits } = await i18nShaking(
    ['tests/fit/__fixtures__/import_name.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['trans']));
  assert.equal(JSON.stringify(results), JSON.stringify(['hello']));
});
test('正确识别路径', async () => {
  const { results, fits } = await i18nShaking(
    ['tests/fit/__fixtures__/import_from.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['trans']));
  assert.equal(JSON.stringify(results), JSON.stringify(['world', 'hello']));
});
test('正确识别名称路径', async () => {
  const { results, fits } = await i18nShaking(
    ['tests/fit/__fixtures__/import_namepath.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(results), JSON.stringify(['use_tt']));
});
test('正确识别嵌套', async () => {
  const { results, fits } = await i18nShaking(
    ['tests/fit/__fixtures__/importmulti/index.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(results), JSON.stringify(['child', 'hello']));
});

test.run();
