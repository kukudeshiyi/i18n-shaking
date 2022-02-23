import { TranslateKeyFileData, ConfigParams } from '../types/index';
import { CONFIG_PARAMS } from '../constants';
import { readFile } from 'fs/promises';

export async function readTranslateKeyFile(
  configParams: ConfigParams
): Promise<Array<TranslateKeyFileData>> {
  const translateFileNames = configParams[CONFIG_PARAMS.TRANSLATE_FILE_NAMES];
  const translateKeyFileDataArr = await Promise.all(
    translateFileNames.map(async (translateFileName) => {
      const translateKeyFileJson = await readFile(translateFileName, 'utf8');
      return JSON.parse(translateKeyFileJson);
    })
  ).catch(() => {
    return [];
  });
  return translateKeyFileDataArr;
}
