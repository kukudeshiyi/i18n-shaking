import { i18nShaking } from '../../src/utilsfortest';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from 'typescript';

test('import from "i18n" as', async () => {
  const { results, errors, fits } = await i18nShaking(
    ['tests/fit/__fixtures__/import_from.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['trans']));
  assert.equal(JSON.stringify(results), JSON.stringify(['world', 'hello']));
});
test('import { i18n, store } from "i18nt"', async () => {
  const { results, errors, fits } = await i18nShaking(
    ['tests/fit/__fixtures__/import_namepath.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['trans', 'i18n']));
  assert.equal(
    JSON.stringify(results),
    JSON.stringify(['name_key', 'age_key', 'hello'])
  );
});
test('import multi', async () => {
  const { results, errors, fits } = await i18nShaking(
    ['tests/fit/__fixtures__/importmulti/index.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['i18n', 'trans']));
  assert.equal(JSON.stringify(errors), '[]');
});
test('import default from "i18n"', async () => {
  const { results, errors, fits } = await i18nShaking(
    ['tests/fit/__fixtures__/default.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['trans']));
  assert.equal(JSON.stringify(results), JSON.stringify(['hello']));
});
test('import {i18n} from  other', async () => {
  const { results, errors, fits } = await i18nShaking(
    ['tests/fit/__fixtures__/import_name.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['trans']));
  assert.equal(JSON.stringify(results), JSON.stringify(['hello']));
});

test.run();
