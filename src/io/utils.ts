import { access, stat } from 'fs/promises';
import { constants } from 'fs';
import { isAbsolute, join } from 'path';
import { HandlePathOptions } from '../types';
import { PATH_TYPE, PATH_CHECK_STATUS } from '../constants';

export async function isValidPath(path: string) {
  const isValid = await access(path)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });

  return isValid;
}

export async function isFileReadable(path: string) {
  const isReadable = await access(path, constants.R_OK)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });

  return isReadable;
}

export async function isFileWritable(path: string) {
  const isWritable = await access(path, constants.W_OK)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });

  return isWritable;
}

export async function isDirectory(path: string) {
  try {
    const isDirectory = await stat(path).then((stat) => {
      return stat.isDirectory();
    });
    return isDirectory;
  } catch (e) {
    return Promise.reject();
  }
}

export function isAbsolutePath(path: string) {
  return isAbsolute(path);
}

// 校验 & 处理路径
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
