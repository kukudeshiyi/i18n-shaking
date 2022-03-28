import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { handleConfigParams } from '../../src/validateConfigParams';
import {
  successCase,
  failedCase1,
  failedCase2,
  rootPath,
} from './__fixtures__/cases';
import { join } from 'path';

test('the parameters are processed correctly and successfully', async () => {
  const { status, handleConfigParams: handleParams } = await handleConfigParams(
    successCase,
    rootPath
  );

  assert.equal(status, true);

  const {
    entry,
    translateFileNames,
    output,
    translateFileDirectoryPath,
    pattern,
    frame,
    keyWhiteList,
  } = handleParams!;

  assert.equal(output, join(rootPath, './output'));
  assert.equal(translateFileDirectoryPath, join(rootPath, './assert'));
  assert.equal(frame, successCase.frame);
  assert.equal(successCase.pattern, pattern);
  assert.equal(successCase.keyWhiteList, keyWhiteList);
  successCase.entry.forEach((path, index) => {
    assert.equal(entry[index], join(rootPath, path));
  });
  successCase.translateFileNames.forEach((name, index) => {
    assert.equal(
      translateFileNames[index],
      join(translateFileDirectoryPath, `./${name}`)
    );
  });
});

test('processing failed due to malformed format', async () => {
  const { status, handleConfigParams: handleParams } = await handleConfigParams(
    undefined
  );
  assert.equal(status, false);
  assert.equal(handleParams, null);
});

test('incorrect parameter content causes validation failure', async () => {
  const {
    status,
    handleConfigParams: handleParams,
    validateErrors,
  } = await handleConfigParams(failedCase1);
  assert.equal(status, false);
  assert.equal(validateErrors.length, 6);
  assert.type(handleParams, 'object');
});

test('parameter format error causes validation failure', async () => {
  const {
    status,
    handleConfigParams: handleParams,
    validateErrors,
  } = await handleConfigParams(failedCase2);
  assert.equal(status, false);
  assert.equal(validateErrors.length, 6);
  assert.type(handleParams, 'object');
});

test('optional params', async () => {
  delete successCase.keyWhiteList;
  assert.equal(successCase.keyWhiteList, undefined);
  const { status } = await handleConfigParams(successCase, rootPath);
  assert.equal(status, true);
});

test.run();
