import { join } from 'path';
import { HandlePathOptions } from './types';
import { PATH_TYPE, PATH_CHECK_STATUS } from './constants';
import { isValidPath, isAbsolutePath, isDirectory } from './utils';

export async function handlePath(path: string, options: HandlePathOptions) {
  const { expect, rootPath } = options;
  const isAbsolute = isAbsolutePath(path);
  if (!isAbsolute) {
    path = join(rootPath || process.cwd(), path);
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
