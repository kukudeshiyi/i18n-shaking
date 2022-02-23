import { join } from 'path';
import { CONFIG_PARAMS } from '../../../src/constants';

export const TEST_OUTPUT_PATH = join(__dirname, './output');

export const TEST_TRANSLATE_FILE_NAMES = [
  join(__dirname, './output/en.json'),
  join(__dirname, './output/other.json'),
];

export const case1 = {
  param1: [
    {
      key1: 'en',
    },
    {
      key1: 'other',
    },
  ],
  param2: {
    [CONFIG_PARAMS.OUTPUT]: TEST_OUTPUT_PATH,
    [CONFIG_PARAMS.TRANSLATE_FILE_NAMES]: TEST_TRANSLATE_FILE_NAMES,
  },
};
