import ts from 'typescript';
import { ConfigParams, PluginType } from './types/index';
import { loadingPlugins } from './loadingPlugins';
import buildInPlugins from './plugins';
import { readConfigFile, readTsConfig } from './io';
import { handleConfigParams as validateConfigParams } from './validateConfigParams';
import { logMessages } from './utils';
import { FRAME, LOG_TYPE } from './constants';
import { runPlugins } from './runPlugins';
import { shaking } from './shaking';
import { outputLogger } from './logger';
import { handleCompilerOptions } from './handleCompilerOptions';

export async function i18nShaking(options: { log: boolean }) {
  const { log } = options;
  logMessages(['start shaking...'], LOG_TYPE.NORMAL);

  const configParams = await readConfigFile();
  if (!configParams) {
    return;
  }

  const { status: validateStatus, handleConfigParams } =
    await validateConfigParams(configParams);
  if (!validateStatus || !handleConfigParams) {
    return;
  }

  const allPlugins = loadingPlugins(buildInPlugins);
  const projectTsConfigCompilerOptions = await readTsConfig();
  const { results, warnings, sourceFiles } = runPlugins(
    allPlugins,
    handleConfigParams,
    handleCompilerOptions(projectTsConfigCompilerOptions, handleConfigParams)
  );
  if (results.length <= 0) {
    return;
  }

  const shakingStatus = shaking(results, handleConfigParams!);
  if (!shakingStatus) {
    return;
  }

  logMessages(
    [
      'The processed translation key content has been output to the target folder',
    ],
    LOG_TYPE.SUCCESS
  );

  log &&
    outputLogger({
      sourceFileNames: sourceFiles.map((sourceFile) => sourceFile.fileName),
      warnings,
    });
}

export async function i18nShakingForTest(
  file: string[],
  options?: ts.CompilerOptions
) {
  const allPlugins: PluginType[] = loadingPlugins(buildInPlugins);
  const configParam: ConfigParams = {
    entry: file,
    translateFileDirectoryPath: '',
    translateFileNames: [''],
    output: '',
    pattern: [
      { name: 'i18n', path: '' }, // 匹配-导出名
      { name: '', path: 'i18nDir' }, // 匹配-导入路径
      { name: 't', path: 'i18n-t' }, // 匹配导出名以及导入路径
      { name: 'useTranslation', path: 'react-i18next' },
    ],
    frame: FRAME.REACT,
    keyWhiteList: [],
  };
  return await runPlugins(allPlugins, configParam, options);
}
