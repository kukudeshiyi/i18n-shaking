import { i18nShakingForTest as i18nShaking } from '../../src/index';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from 'typescript';

test('dynamic tranlation should be scan', async () => {
  const { results, errors } = await i18nShaking(
    ['tests/dynamic/__fixtures__/single.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(results), JSON.stringify(['helloworldbrandon']));
  assert.equal(JSON.stringify(errors), '[]');
});

test('multi dynamic tranlation should be scan', async () => {
  const { results, errors } = await i18nShaking(
    ['tests/dynamic/__fixtures__/multi.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(
    JSON.stringify(results),
    JSON.stringify(['helloworldbrandonx~'])
  );
  assert.equal(JSON.stringify(errors), '[]');
});

test('dynamic single from other tranlation should be scan', async () => {
  const { results, errors } = await i18nShaking(
    ['tests/dynamic/__fixtures__/fromothercomponent/single.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(JSON.stringify(results), JSON.stringify(['helloworldbrandon']));
  assert.equal(JSON.stringify(errors), '[]');
});

test('dynamic multi from other tranlation should be scan', async () => {
  const { results, errors } = await i18nShaking(
    ['tests/dynamic/__fixtures__/fromothercomponent/multi.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(
    JSON.stringify(results),
    JSON.stringify(['helloworldbrandon!!!'])
  );
  assert.equal(JSON.stringify(errors), '[]');
});

test.run();
