import ts from 'typescript';
import { PluginType } from './types/index';
import { loadingPlugins } from './loadingPlugins';
import buildInPlugins from './plugins';
import { readConfigFile } from './io';
import { handleConfigParams as validateConfigParams } from './validateConfigParams';
import { logMessages } from './utils';
import { LOG_TYPE } from './constants';
import { runPlugins } from './runPlugins';
import { shaking } from './shaking';

export async function i18nShaking(
  file: string[],
  options?: ts.CompilerOptions
) {
  const configParams = await readConfigFile();
  if (!configParams) {
    return;
  }
  const { status, validateErrors, handleConfigParams } =
    await validateConfigParams(configParams);
  if (!status) {
    logMessages(validateErrors, LOG_TYPE.ERROR);
    return;
  }
  const allPlugins: PluginType[] = loadingPlugins(buildInPlugins);
  const { results, warnings } = runPlugins(
    file,
    allPlugins,
    handleConfigParams!,
    options
  );

  shaking(results, warnings, handleConfigParams!);
}

export async function i18nShakingForTest(
  file: string[],
  options?: ts.CompilerOptions
) {
  const allPlugins: PluginType[] = loadingPlugins(buildInPlugins);
  const configParam = {
    entry: '',
    translateFileDirectoryPath: '',
    translateFileNames: [''],
    output: '',
    importInfos: [
      { name: 'i18n', path: '' }, // 匹配-导出名
      { name: '', path: 'i18nDir' }, // 匹配-导入路径
      { name: 't', path: 'i18n-t' }, // 匹配导出名以及导入路径
      { name: 'useTranslation', path: 'react-i18next' },
    ],
  };
  return await runPlugins(file, allPlugins, configParam, options);
}
