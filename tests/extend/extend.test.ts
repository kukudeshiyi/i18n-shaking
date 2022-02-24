import { i18nShakingForTest as i18nShaking } from '../../src/index';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from 'typescript';

test('string concatenation tranlation should be scan', async () => {
  const { results, warnings, fits } = await i18nShaking(
    ['tests/extend/__fixtures__/single.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['i18n', 't']));
  assert.equal(JSON.stringify(results), JSON.stringify(['helloworld']));
});

test('string concatenation tranlation should be scan', async () => {
  const { results, warnings, fits } = await i18nShaking(
    ['tests/extend/__fixtures__/multi.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(fits), JSON.stringify(['useTranslation', 't']));
  assert.equal(JSON.stringify(results), JSON.stringify(['helloworldbrandon']));
});

test.run();
