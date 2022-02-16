import { readFile } from 'fs/promises';
import path from 'path';
import { ConfigParams } from '../types';
import { CONFIG_FILE_NAME } from '../constants';
import { isAbsolutePath, isDirectory, isValidPath } from './utils';

export async function readConfigFile(): Promise<ConfigParams | undefined> {
  const currentExecPath = process.cwd();
  const configFilePath = path.join(currentExecPath, CONFIG_FILE_NAME);
  const configJson = await readFile(configFilePath, 'utf8').catch((e) => {
    console.log('config file not found!');
  });

  if (!configJson) {
    return;
  }

  try {
    const configObject = JSON.parse(configJson);
    return configObject;
  } catch (e) {
    console.log('failed to read config file!');
    return;
  }
}
