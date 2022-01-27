import i18nShaking from '../../src/index'
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import ts from "typescript";

test('dynamic tranlation should be scan', async () => {
  const { handleResults, errors } = i18nShaking(['tests/dynamic/__fixtures__/input.tsx'], {
    jsx: ts.JsxEmit.ReactNative,
  });
  assert.equal(JSON.stringify(handleResults), JSON.stringify(['helloworld']));
  assert.equal(JSON.stringify(errors), '[]');
});


test.run();
