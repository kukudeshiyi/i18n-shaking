import fs from 'fs';
import path from 'path';
import { ConfigParams } from '../types';
import { CONFIG_FILE_NAME, LOG_TYPE } from '../constants';
import { logMessages } from '../utils';

export async function readConfigFile(
  configFilePath?: string
): Promise<ConfigParams | undefined> {
  const currentExecPath = process.cwd();
  configFilePath =
    configFilePath || path.join(currentExecPath, CONFIG_FILE_NAME);
  const configJson = await fs.promises
    .readFile(configFilePath, 'utf8')
    .catch((e) => {
      logMessages(['config file not found'], LOG_TYPE.ERROR);
    });

  if (!configJson) {
    return;
  }

  try {
    const configObject = JSON.parse(configJson);
    return configObject;
  } catch (e) {
    logMessages(['Failed to parse configuration file'], LOG_TYPE.ERROR);
    return;
  }
}
