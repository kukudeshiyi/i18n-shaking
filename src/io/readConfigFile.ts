import exp from 'constants';
import { readFile } from 'fs/promises';
import path from 'path';
import { ConfigParams } from '../types';
import { isAbsolutePath, isDirectory, isValidPath } from './utils';

const CONFIG_FILE_NAME = 'i18nShaking.config.json';
const OBJECT_FLAG = '[object Object]';

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

export function validateConfigParams(configParams: ConfigParams | undefined) {
  let validateStatus = true;
  const isObject =
    Object.prototype.toString.apply(configParams) === OBJECT_FLAG;
  if (!isObject) {
    validateStatus = false;
    return validateStatus;
  }
  const { entry, output, translateFileDirectoryPath, translateFileName } =
    configParams!;

  return validateStatus;
}
