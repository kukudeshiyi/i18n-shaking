import { access, stat } from 'fs/promises';
import { constants } from 'fs';
import { isAbsolute } from 'path';

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
