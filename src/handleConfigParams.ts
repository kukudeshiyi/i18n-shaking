import { join } from 'path';
import { HandlePathOptions } from './types';
import { PATH_TYPE, PATH_CHECK_STATUS } from './constants';
import {
  isValidPath,
  isAbsolutePath,
  isDirectory,
  isFileReadable,
  isFileWritable,
} from './utils';

export async function handlePath(path: string, options: HandlePathOptions) {
  const { expect, checkReadable = true, checkWritable = true } = options;
  const isAbsolute = isAbsolutePath(path);
  if (!isAbsolute) {
    path = join(process.cwd(), path);
  }

  const isValid = await isValidPath(path);
  if (!isValid) {
    return {
      status: PATH_CHECK_STATUS.FAILED_NOT_VALID,
      path,
    };
  }

  const isFile = !(await isDirectory(path));
  const isExpectFile = expect === PATH_TYPE.FILE;

  if (isExpectFile && !isFile) {
    return {
      status: PATH_CHECK_STATUS.FAILED_NOT_FILE,
      path,
    };
  }

  if (!isExpectFile && isFile) {
    return {
      status: PATH_CHECK_STATUS.FAILED_NOT_DIRECTORY,
      path,
    };
  }

  if (expect === PATH_TYPE.FILE && isFile && checkReadable) {
    const isReadable = await isFileReadable(path);
    if (!isReadable) {
      return {
        status: PATH_CHECK_STATUS.FAILED_FILE_NOT_READABLE,
        path,
      };
    }
  }

  if (expect === PATH_TYPE.FILE && isFile && checkWritable) {
    const isWritable = await isFileWritable(path);
    if (!isWritable) {
      return {
        status: PATH_CHECK_STATUS.FAILED_FILE_NOT_WRITABLE,
        path,
      };
    }
  }

  return {
    status: PATH_CHECK_STATUS.SUCCESS,
    path,
  };
}

export async function handleTranslateNames(
  handleTranslateFileDirectoryPath: string,
  translateFileNames: string[]
): Promise<string[]> {
  return translateFileNames.map((translateFileName) => {
    return join(handleTranslateFileDirectoryPath, translateFileName);
  });
}
