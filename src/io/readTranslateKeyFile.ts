import { TranslateKeyFileData, ConfigParams } from '../types/index';
import { CONFIG_PARAMS } from '../constants';
import fs from 'fs';

export async function readTranslateKeyFile(
  configParams: ConfigParams
): Promise<Array<TranslateKeyFileData>> {
  const translateFileNames = configParams[CONFIG_PARAMS.TRANSLATE_FILE_NAMES];
  const translateKeyFileDataArr = await Promise.all(
    translateFileNames.map(async (translateFileName) => {
      const translateKeyFileJson = await fs.promises.readFile(
        translateFileName,
        'utf8'
      );
      return JSON.parse(translateKeyFileJson);
    })
  ).catch(() => {
    return [];
  });
  return translateKeyFileDataArr;
}
