import { TranslateKeyFileData, ConfigParams } from '../types/index';
import { CONFIG_PARAMS } from '../constants';
import { basename, join } from 'path';
import { writeFile } from 'fs/promises';

export async function output(
  translateKeys: Array<TranslateKeyFileData>,
  configParams: ConfigParams
): Promise<boolean> {
  const output = configParams[CONFIG_PARAMS.OUTPUT];
  const translateFileNames = configParams[CONFIG_PARAMS.TRANSLATE_FILE_NAMES];
  const outputFileNames = translateFileNames.map((translateFileName) =>
    basename(translateFileName)
  );
  const outputFilePaths = outputFileNames.map((fileName) =>
    join(output, fileName)
  );
  try {
    const handleTranslateKeysJson = translateKeys.map((keysObj) =>
      JSON.stringify(keysObj, null, 4)
    );

    await Promise.all(
      outputFilePaths.map(async (path, index) => {
        return await writeFile(path, handleTranslateKeysJson[index]);
      })
    );
  } catch (e) {
    return false;
  }
  return true;
}
