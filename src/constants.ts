export const CONFIG_FILE_NAME = 'i18nShaking.config.json';
export const OBJECT_FLAG = '[object Object]';
export enum PATH_TYPE {
  FILE = 1,
  DIRECTORY = 2,
}

export enum PARAMS_CHECK_STATUS {
  SUCCESS = 1,
  FAILED_NOT_VALID = 2,
  FAILED_NOT_FILE = 3,
  FAILED_NOT_DIRECTORY = 4,
  FAILED_FILE_NOT_READABLE = 5,
  FAILED_FILE_NOT_WRITABLE = 6,
  FAILED = 7,
}

export enum CONFIG_PARAMS {
  ENTRY = 'entry',
  TRANSLATE_FILE_DIRECTORY_PATH = 'translateFileDirectoryPath',
  TRANSLATE_FILE_NAMES = 'translateFileNames',
  OUTPUT = 'output',
  IMPORT_INFOS = 'importInfos',
  FRAME = 'frame',
  KEY_WHITE_LIST = 'keyWhiteList',
}

export enum LOG_TYPE {
  SUCCESS = 'green',
  ERROR = 'red',
  WARNING = 'yellow',
  NORMAL = 'white',
}

export enum FRAME {
  REACT = 'react',
  REACT_NATIVE = 'react-native',
}
