import { ConfigParams } from './types';
import { OBJECT_FLAG } from './constants';
import { handlePath, handleTranslateNames } from './handleConfigParams';
import { PATH_CHECK_STATUS, PATH_TYPE, CONFIG_PARAMS } from './constants';

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
  const translateFileNames = configParams![CONFIG_PARAMS.TRANSLATE_FILE_NAMES];
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
      const { status, path } = await handlePath(handleTranslatePath, {
        expect: PATH_TYPE.FILE,
        checkWritable: true,
      });
      if (!status) {
        validateStatus = false;
        validateErrors.push(
          `The translation file with the filename ${translateFileNames[index]} in the ${CONFIG_PARAMS.TRANSLATE_FILE_NAMES} parameter was not found`
        );
      }
    })
  );

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
      translateFileNames,
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
