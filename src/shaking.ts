import { ConfigParams } from './types/index';
import { output, readTranslateKeyFile } from './io';
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
    return {
      status: false,
      outputKeys: [],
    };
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
    return {
      status: false,
      outputKeys: [],
    };
  }

  const filterTranslateKeyFileData = filterTranslateKeyFile(
    results,
    translateKeyFileData
  );

  const outputKeys = Object.keys(filterTranslateKeyFileData[0] || {});

  const outputStatus = await output(filterTranslateKeyFileData, configParams!);

  if (!outputStatus) {
    logMessages(['output failed'], LOG_TYPE.ERROR);
    return {
      status: false,
      outputKeys,
    };
  }

  return {
    status: true,
    outputKeys,
  };
}
