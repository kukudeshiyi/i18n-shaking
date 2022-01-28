import i18nShaking from '../../src/index';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from 'typescript';

test('dynamic tranlation should be scan', async () => {
  const { handleResults, errors } = i18nShaking(
    ['tests/dynamic/__fixtures__/single.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(
    JSON.stringify(handleResults),
    JSON.stringify(['helloworldbrandon'])
  );
  assert.equal(JSON.stringify(errors), '[]');
});

test('multi dynamic tranlation should be scan', async () => {
  const { handleResults, errors } = i18nShaking(
    ['tests/dynamic/__fixtures__/multi.tsx'],
    {
      jsx: ts.JsxEmit.ReactNative,
    }
  );
  assert.equal(
    JSON.stringify(handleResults),
    JSON.stringify(['helloworldbrandonx~'])
  );
  assert.equal(JSON.stringify(errors), '[]');
});

test.run();
