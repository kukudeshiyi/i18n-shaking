import { FindKeys, ConfigParams } from './types/index';
import { output, readTranslateKeyFile } from './io';
import { filterTranslateKeyFile } from './filterTranslateKeyFile';
import { logMessages } from './utils';
import { LOG_TYPE } from './constants';

export async function shaking(
  results: string[],
  warnings: string[],
  configParams: ConfigParams
) {
  const findKeys: FindKeys = Array.from(new Set(results));
  const translateKeyFileData = await readTranslateKeyFile(configParams);
  if (translateKeyFileData.length < 0) {
    logMessages(
      [
        'Failed to read translation file, please check configuration and file content',
      ],
      LOG_TYPE.ERROR
    );
    return;
  }
  // TODO: 校验 json

  const filterTranslateKeyFileData = filterTranslateKeyFile(
    findKeys,
    translateKeyFileData
  );

  const status = await output(filterTranslateKeyFileData, configParams!);

  // TODO: warnings 如何进行处理

  status
    ? logMessages(['Success'], LOG_TYPE.SUCCESS)
    : logMessages(['Failed'], LOG_TYPE.ERROR);
}
