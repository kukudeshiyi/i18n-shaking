import { access, stat } from 'fs/promises';
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

export function isAbsolutePath(path: string) {}

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
