//@ts-nocheck
import { ConfigParams, ImportInfos } from './types';
import { OBJECT_FLAG } from './constants';
import { handlePath, handleTranslateNames } from './handleConfigParams';
import {
  PARAMS_CHECK_STATUS,
  PATH_TYPE,
  CONFIG_PARAMS,
  FRAME,
  LOG_TYPE,
} from './constants';
import { logMessages } from './utils';

export async function handleConfigParams(
  configParams: unknown,
  rootPath?: string
): Promise<{
  status: boolean;
  handleConfigParams: ConfigParams | null;
  validateErrors: string[];
}> {
  // 基础格式校验
  let validateStatus = true;
  const validateErrors = [];
  const isObject = ((
    configParams
  ): configParams is { [key: string]: unknown } =>
    Object.prototype.toString.apply(configParams) === OBJECT_FLAG)(
    configParams
  );
  if (!isObject) {
    validateStatus = false;
    validateErrors.push(
      'The content of the configuration file should be a json object!'
    );
    logMessages(validateErrors, LOG_TYPE.ERROR);
    return {
      status: validateStatus,
      handleConfigParams: null,
      validateErrors,
    };
  }

  // 获取参数
  const entry = configParams[CONFIG_PARAMS.ENTRY];
  const output = configParams[CONFIG_PARAMS.OUTPUT];
  const translateFileDirectoryPath =
    configParams[CONFIG_PARAMS.TRANSLATE_FILE_DIRECTORY_PATH];
  const translateFileNames = configParams[CONFIG_PARAMS.TRANSLATE_FILE_NAMES];
  const importInfos = configParams[CONFIG_PARAMS.IMPORT_INFOS];
  const frame = configParams[CONFIG_PARAMS.FRAME];
  const keyWhiteList = configParams[CONFIG_PARAMS.KEY_WHITE_LIST];

  let handleEntryPaths: string[] = [];
  if (
    Array.isArray(entry) &&
    entry.length > 0 &&
    entry.every((pathItem) => typeof pathItem === 'string')
  ) {
    handleEntryPaths = await Promise.all(
      entry.map(async (pathItem, index) => {
        const { status, path } = await handlePath(pathItem, {
          expect: PATH_TYPE.FILE,
          rootPath,
        });
        if (status !== PARAMS_CHECK_STATUS.SUCCESS) {
          validateStatus = false;
          validateErrors.push(
            createCheckConfigParamsErrorMessage(
              status,
              `${CONFIG_PARAMS.ENTRY}[${index}]` as CONFIG_PARAMS
            )
          );
        }
        return path;
      })
    );
  } else {
    validateStatus = false;
    validateErrors.push(
      createCheckConfigParamsErrorMessage(
        PARAMS_CHECK_STATUS.FAILED,
        CONFIG_PARAMS.ENTRY
      )
    );
  }

  // 对 output 的校验处理
  const { status: handleOutputStatus, path: handleOutputPath } =
    await handlePath(typeof output === 'string' ? output : '', {
      expect: PATH_TYPE.DIRECTORY,
      rootPath,
    });

  if (handleOutputStatus !== PARAMS_CHECK_STATUS.SUCCESS) {
    validateStatus = false;
    validateErrors.push(
      createCheckConfigParamsErrorMessage(
        handleOutputStatus,
        CONFIG_PARAMS.OUTPUT
      )
    );
  }

  //  对 translateFileDirectoryPath 的校验处理
  const {
    status: handleTranslateFileDirectoryStatus,
    path: handleTranslateFileDirectoryPath,
  } = await handlePath(
    typeof translateFileDirectoryPath === 'string'
      ? translateFileDirectoryPath
      : '',
    {
      expect: PATH_TYPE.DIRECTORY,
      rootPath,
    }
  );

  if (handleTranslateFileDirectoryStatus !== PARAMS_CHECK_STATUS.SUCCESS) {
    validateStatus = false;
    validateErrors.push(
      createCheckConfigParamsErrorMessage(
        handleTranslateFileDirectoryStatus,
        CONFIG_PARAMS.TRANSLATE_FILE_DIRECTORY_PATH
      )
    );
  }

  // 对 translateFileNames 的校验处理
  let handleTranslatePaths: string[] = [];
  if (
    handleTranslateFileDirectoryStatus === PARAMS_CHECK_STATUS.SUCCESS &&
    Array.isArray(translateFileNames) &&
    translateFileNames.length > 0 &&
    translateFileNames.every((name) => typeof name === 'string')
  ) {
    handleTranslatePaths = await handleTranslateNames(
      handleTranslateFileDirectoryPath,
      translateFileNames
    );

    await Promise.all(
      handleTranslatePaths.map(async (handleTranslatePath, index) => {
        const { status } = await handlePath(handleTranslatePath, {
          expect: PATH_TYPE.FILE,
          rootPath,
        });
        if (status !== PARAMS_CHECK_STATUS.SUCCESS) {
          validateStatus = false;
          validateErrors.push(
            createCheckConfigParamsErrorMessage(
              status,
              `${CONFIG_PARAMS.TRANSLATE_FILE_NAMES}[${index}]` as CONFIG_PARAMS
            )
          );
        }
      })
    );
  } else {
    validateStatus = false;
    handleTranslateFileDirectoryStatus === PARAMS_CHECK_STATUS.SUCCESS &&
      validateErrors.push(
        createCheckConfigParamsErrorMessage(
          PARAMS_CHECK_STATUS.FAILED,
          CONFIG_PARAMS.TRANSLATE_FILE_NAMES
        )
      );
  }

  // 对 importInfos 的校验处理
  if (
    !Array.isArray(importInfos) ||
    importInfos.length === 0 ||
    !importInfos.every((importInfoItem) => {
      return typeof importInfoItem?.name === 'string';
    })
  ) {
    validateStatus = false;
    validateErrors.push(
      createCheckConfigParamsErrorMessage(
        PARAMS_CHECK_STATUS.FAILED,
        CONFIG_PARAMS.IMPORT_INFOS
      )
    );
  }

  // 对 frame 进行校验
  if (
    typeof frame !== 'string' ||
    //@ts-ignore
    !Object.keys(FRAME).some((key) => FRAME[key] === frame)
  ) {
    validateStatus = false;
    validateErrors.push(
      createCheckConfigParamsErrorMessage(
        PARAMS_CHECK_STATUS.FAILED,
        CONFIG_PARAMS.FRAME
      )
    );
  }

  // 对 keyWhiteList 进行校验
  let handleKeyWhiteList: string[] = [];
  if (keyWhiteList !== undefined) {
    if (
      !Array.isArray(keyWhiteList) ||
      !keyWhiteList.every((key) => typeof key === 'string')
    ) {
      validateStatus = false;
      validateErrors.push(
        createCheckConfigParamsErrorMessage(
          PARAMS_CHECK_STATUS.FAILED,
          CONFIG_PARAMS.KEY_WHITE_LIST
        )
      );
    } else {
      handleKeyWhiteList = keyWhiteList;
    }
  }

  if (!validateStatus) {
    logMessages(validateErrors, LOG_TYPE.ERROR);
  }

  return {
    status: validateStatus,
    validateErrors,
    handleConfigParams: {
      entry: handleEntryPaths,
      output: handleOutputPath,
      translateFileDirectoryPath: handleTranslateFileDirectoryPath,
      translateFileNames: handleTranslatePaths,
      importInfos: importInfos as ImportInfos[],
      frame: frame as FRAME,
      keyWhiteList: handleKeyWhiteList,
    },
  };
}

export function createCheckConfigParamsErrorMessage(
  pathCheckStatus: PARAMS_CHECK_STATUS,
  configParamsName: CONFIG_PARAMS
) {
  switch (pathCheckStatus) {
    case PARAMS_CHECK_STATUS.FAILED_NOT_VALID:
      return `The ${configParamsName} parameter configuration path is invalid, please check`;
    case PARAMS_CHECK_STATUS.FAILED_NOT_FILE:
      return `The ${configParamsName} parameter configuration path is not a file, please check`;
    case PARAMS_CHECK_STATUS.FAILED_NOT_DIRECTORY:
      return `The ${configParamsName} parameter configuration path is not a folder, please check`;
    case PARAMS_CHECK_STATUS.FAILED_FILE_NOT_READABLE:
      return `The ${configParamsName} parameter configuration path is not an unreadable file, please check`;
    case PARAMS_CHECK_STATUS.FAILED_FILE_NOT_WRITABLE:
      return `The ${configParamsName} parameter configuration path is not a non-writable file, please check`;
    case PARAMS_CHECK_STATUS.FAILED:
    default:
      return `The ${configParamsName} parameter is wrong, please check`;
  }
}
