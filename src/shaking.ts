import { ConfigParams } from './types/index';
import { readTranslateKeyFile } from './io';
import { filterTranslateKeyFile } from './filterTranslateKeyFile';
import { logMessages } from './utils';
import { LOG_TYPE, OBJECT_FLAG } from './constants';

export async function shaking(results: string[], configParams: ConfigParams) {
  const translateKeyFileData = await readTranslateKeyFile(configParams);
  if (
    translateKeyFileData.length <= 0 ||
    !translateKeyFileData.every(
      (item) => Object.prototype.toString.apply(item) === OBJECT_FLAG
    )
  ) {
    logMessages(
      [
        'Failed to read translation file or the content of the translation file is wrong, please check',
      ],
      LOG_TYPE.ERROR
    );
    return [];
  }

  if (
    !translateKeyFileData.every(
      (item) => Object.prototype.toString.apply(item) === OBJECT_FLAG
    )
  ) {
    logMessages(
      ['The content of the translation file is incorrect, please check'],
      LOG_TYPE.ERROR
    );
    return [];
  }

  const filterTranslateKeyFileData = filterTranslateKeyFile(
    results,
    translateKeyFileData
  );

  return filterTranslateKeyFileData;
}
