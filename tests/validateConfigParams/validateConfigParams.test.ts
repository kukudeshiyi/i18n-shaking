import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { handleConfigParams } from '../../src/validateConfigParams';
import { successCase, failedCase, rootPath } from './__fixtures__/cases';
import { join } from 'path';

test('the parameters are processed correctly and successfully', async () => {
  const {
    status,
    validateErrors,
    handleConfigParams: handleParams,
  } = await handleConfigParams(successCase, rootPath);
  assert.equal(status, true);

  const { entry, translateFileNames, output, translateFileDirectoryPath } =
    handleParams!;

  assert.equal(validateErrors.length, 0);
  assert.equal(entry, join(rootPath, './src/index.ts'));
  assert.equal(output, join(rootPath, './output'));
  assert.equal(translateFileDirectoryPath, join(rootPath, './assert'));

  successCase.translateFileNames.forEach((name, index) => {
    assert.equal(
      translateFileNames[index],
      join(translateFileDirectoryPath, `./${name}`)
    );
  });
});

test('processing failed due to malformed format', async () => {
  const {
    status,
    validateErrors,
    handleConfigParams: handleParams,
  } = await handleConfigParams(undefined);
  assert.equal(status, false);
  assert.equal(validateErrors.length, 1);
  assert.equal(handleParams, null);
});

test('parameter error causes validation to fail', async () => {
  const {
    status,
    validateErrors,
    handleConfigParams: handleParams,
  } = await handleConfigParams(failedCase);
  assert.equal(status, false);
  assert.not.equal(validateErrors.length, 0);
  assert.type(handleParams, 'object');
});

test.run();
