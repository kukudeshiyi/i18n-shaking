import { FindKeys, ConfigParams } from './types/index';
import { output, readTranslateKeyFile } from './io';
import { filterTranslateKeyFile } from './filterTranslateKeyFile';

export async function shaking(results: string[], configParams: ConfigParams) {
  const findKeys: FindKeys = Array.from(new Set(results));
  const translateKeyFileData = await readTranslateKeyFile(configParams);
  const filterTranslateKeyFileData = filterTranslateKeyFile(
    findKeys,
    translateKeyFileData
  );
  output(filterTranslateKeyFileData, configParams!);
}
