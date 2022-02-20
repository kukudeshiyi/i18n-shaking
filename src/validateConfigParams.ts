import { ConfigParams } from './types';
import { OBJECT_FLAG } from './constants';
import { handlePath } from './io/utils';
import { PATH_CHECK_STATUS, PATH_TYPE, CONFIG_PARAMS } from './constants';

// 对于路径的校验
// 判断路径是不是绝对路径，不是绝对路径转成绝对路径
// 判断当前路径是否为有效路径
// 路径是文件路径还是文件夹路径
// 对于需要文件路径但是配置为文件夹的路径进行文件匹配（文件名联想）
// 如果是文件还要判断文件是否可读或者可写
export async function handleConfigParams(
  configParams: ConfigParams | undefined
) {
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

  const entry = configParams![CONFIG_PARAMS.ENTRY];
  const output = configParams![CONFIG_PARAMS.OUTPUT];
  const translateFileDirectoryPath =
    configParams![CONFIG_PARAMS.TRANSLATE_FILE_DIRECTORY_PATH];
  const translateFileName = configParams![CONFIG_PARAMS.TRANSLATE_FILE_NAME];
  const importInfos = configParams![CONFIG_PARAMS.IMPORT_INFOS];

  const { status: handleEntryPathStatus, path: handleEntryPath } =
    await handlePath(entry, {
      expect: PATH_TYPE.FILE,
      checkReadable: true,
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

  const { status: handleOutputStatus, path: handleOutputPath } =
    await handlePath(output, {
      expect: PATH_TYPE.DIRECTORY,
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

  const {
    status: handleTranslateFileDirectoryStatus,
    path: handleTranslateFileDirectoryPath,
  } = await handlePath(translateFileDirectoryPath, {
    expect: PATH_TYPE.DIRECTORY,
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

  if (!Array.isArray(translateFileName) || translateFileName.length <= 0) {
    validateStatus = false;
    validateErrors.push(
      `The ${CONFIG_PARAMS.TRANSLATE_FILE_NAME} parameter is wrong, please check`
    );
  }

  if (
    !Array.isArray(importInfos) ||
    !importInfos.every((importInfoItem) => {
      return !!importInfoItem.name;
    })
  ) {
    validateStatus = false;
    validateErrors.push(
      `The ${CONFIG_PARAMS.IMPORT_INFOS} parameter is wrong, please check`
    );
  }

  return {
    status: validateStatus,
    validateErrors,
    handleConfigParams: {
      entry: handleEntryPath,
      output: handleOutputPath,
      translateFileDirectoryPath: handleTranslateFileDirectoryPath,
      translateFileName,
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
