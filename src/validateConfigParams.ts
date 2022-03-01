import { ConfigParams } from './types';
import { OBJECT_FLAG } from './constants';
import { handlePath, handleTranslateNames } from './handleConfigParams';
import {
  PATH_CHECK_STATUS,
  PATH_TYPE,
  CONFIG_PARAMS,
  FRAME,
} from './constants';

export async function handleConfigParams(
  configParams: ConfigParams | undefined,
  rootPath?: string
): Promise<{
  status: boolean;
  validateErrors: string[];
  handleConfigParams: ConfigParams | null;
}> {
  // 基础格式校验
  let validateStatus = true;
  const validateErrors = [];
  const isObject =
    Object.prototype.toString.apply(configParams) === OBJECT_FLAG;
  if (!isObject) {
    validateStatus = false;
    validateErrors.push(
      'The content of the configuration file should be a json object!'
    );
    return {
      status: validateStatus,
      validateErrors,
      handleConfigParams: null,
    };
  }

  // 获取参数
  const entry = configParams![CONFIG_PARAMS.ENTRY];
  const output = configParams![CONFIG_PARAMS.OUTPUT];
  const translateFileDirectoryPath =
    configParams![CONFIG_PARAMS.TRANSLATE_FILE_DIRECTORY_PATH];
  const translateFileNames = configParams![CONFIG_PARAMS.TRANSLATE_FILE_NAMES];
  const importInfos = configParams![CONFIG_PARAMS.IMPORT_INFOS];
  const frame = configParams![CONFIG_PARAMS.FRAME];

  // TODO: 对于路径应该为 unknown

  // 对 entry 的校验处理
  const { status: handleEntryPathStatus, path: handleEntryPath } =
    await handlePath(entry, {
      expect: PATH_TYPE.FILE,
      rootPath,
    });

  if (handleEntryPathStatus !== PATH_CHECK_STATUS.SUCCESS) {
    validateStatus = false;
    validateErrors.push(
      createCheckConfigParamsErrorMessage(
        handleEntryPathStatus,
        CONFIG_PARAMS.ENTRY
      )
    );
  }

  // 对 output 的校验处理
  const { status: handleOutputStatus, path: handleOutputPath } =
    await handlePath(output, {
      expect: PATH_TYPE.DIRECTORY,
      rootPath,
    });

  if (handleOutputStatus !== PATH_CHECK_STATUS.SUCCESS) {
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
  } = await handlePath(translateFileDirectoryPath, {
    expect: PATH_TYPE.DIRECTORY,
    rootPath,
  });

  if (handleTranslateFileDirectoryStatus !== PATH_CHECK_STATUS.SUCCESS) {
    validateStatus = false;
    validateErrors.push(
      createCheckConfigParamsErrorMessage(
        handleTranslateFileDirectoryStatus,
        CONFIG_PARAMS.TRANSLATE_FILE_DIRECTORY_PATH
      )
    );
  }

  // 对 translateFileNames 的校验处理
  if (!Array.isArray(translateFileNames) || translateFileNames.length <= 0) {
    validateStatus = false;
    validateErrors.push(
      `The ${CONFIG_PARAMS.TRANSLATE_FILE_NAMES} parameter is wrong, please check`
    );
  }

  const handleTranslatePaths = await handleTranslateNames(
    handleTranslateFileDirectoryPath,
    translateFileNames
  );

  await Promise.all(
    handleTranslatePaths.map(async (handleTranslatePath, index) => {
      const { status } = await handlePath(handleTranslatePath, {
        expect: PATH_TYPE.FILE,
        rootPath,
      });
      if (status !== PATH_CHECK_STATUS.SUCCESS) {
        validateStatus = false;
        validateErrors.push(
          `The translation file with the filename ${translateFileNames[index]} in the ${CONFIG_PARAMS.TRANSLATE_FILE_NAMES} parameter was not found`
        );
      }
    })
  );

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
      `The ${CONFIG_PARAMS.IMPORT_INFOS} parameter is wrong, please check`
    );
  }

  // TODO:对 frame 的校验处理
  // if (FRAME[frame]) {
  // }

  return {
    status: validateStatus,
    validateErrors,
    handleConfigParams: {
      entry: handleEntryPath,
      output: handleOutputPath,
      translateFileDirectoryPath: handleTranslateFileDirectoryPath,
      translateFileNames: handleTranslatePaths,
      importInfos,
      frame,
    },
  };
}

export function createCheckConfigParamsErrorMessage(
  pathCheckStatus: PATH_CHECK_STATUS,
  configParamsName: CONFIG_PARAMS
) {
  switch (pathCheckStatus) {
    case PATH_CHECK_STATUS.FAILED_NOT_VALID:
      return `The ${configParamsName} parameter configuration path is invalid, please check`;
    case PATH_CHECK_STATUS.FAILED_NOT_FILE:
      return `The ${configParamsName} parameter configuration path is not a file, please check`;
    case PATH_CHECK_STATUS.FAILED_NOT_DIRECTORY:
      return `The ${configParamsName} parameter configuration path is not a folder, please check`;
    case PATH_CHECK_STATUS.FAILED_FILE_NOT_READABLE:
      return `The ${configParamsName} parameter configuration path is not an unreadable file, please check`;
    case PATH_CHECK_STATUS.FAILED_FILE_NOT_WRITABLE:
      return `The ${configParamsName} parameter configuration path is not a non-writable file, please check`;
    default:
      return `The ${configParamsName} parameter is wrong, please check`;
  }
}
