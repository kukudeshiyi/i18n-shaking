import { TranslateKeyFileData } from './types';
import { logMessages } from './utils';
import { LOG_TYPE } from './constants';

export function check(filterTranslateKeyFileData: TranslateKeyFileData[]) {
  const checkEachFileKeyNumberIsEqualStatus = checkEachFileKeyNumberIsEqual(
    filterTranslateKeyFileData
  );
  if (!checkEachFileKeyNumberIsEqualStatus) {
    logMessages(
      ['The number of keys in each output file is not equal, please check'],
      LOG_TYPE.ERROR
    );
  }
  return checkEachFileKeyNumberIsEqualStatus;
}

function checkEachFileKeyNumberIsEqual(
  filterTranslateKeyFileData: TranslateKeyFileData[]
) {
  const firstTranslateKeyFileKeysLength = Object.keys(
    filterTranslateKeyFileData[0]
  ).length;
  const checkStatus = filterTranslateKeyFileData.every((fileData) => {
    return Object.keys(fileData).length === firstTranslateKeyFileKeysLength;
  });
  return checkStatus;
}
