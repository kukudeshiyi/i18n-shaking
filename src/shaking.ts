import { FindKeys, ConfigParams } from './types/index';
import { output, readTranslateKeyFile } from './io';
import { filterTranslateKeyFile } from './filterTranslateKeyFile';
import { logMessages } from './utils';
import { LOG_TYPE, OBJECT_FLAG } from './constants';

export async function shaking(results: string[], configParams: ConfigParams) {
  const findKeys: FindKeys = Array.from(new Set(results));
  const translateKeyFileData = await readTranslateKeyFile(configParams);
  if (translateKeyFileData.length <= 0) {
    logMessages(
      [
        'Failed to read translation file, please check configuration and file content',
      ],
      LOG_TYPE.ERROR
    );
    return false;
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
    return false;
  }

  const filterTranslateKeyFileData = filterTranslateKeyFile(
    findKeys,
    translateKeyFileData
  );

  // TODO: 增加对输出内容为空的检测

  const outputStatus = await output(filterTranslateKeyFileData, configParams!);

  if (!outputStatus) {
    logMessages(['output failed'], LOG_TYPE.ERROR);
    return false;
  }

  return true;
}
