import { TranslateKeyFileData, FindKeys } from './types';
export function filterTranslateKeyFile(
  findKeys: FindKeys,
  translateFileData: Array<TranslateKeyFileData>
): Array<TranslateKeyFileData> {
  return findKeys.reduce((lastValue, key) => {
    translateFileData.forEach((item, index) => {
      const filterTranslateKeyFileDataItem: TranslateKeyFileData = (lastValue[
        index
      ] = lastValue[index] || {});
      const value: string = item[key];
      if (value) {
        filterTranslateKeyFileDataItem[key] = value;
      }
    });
    return lastValue;
  }, []);
}
