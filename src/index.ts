import ts from 'typescript';
import { PluginType, FindKeys, ConfigParams, ImportInfos } from './types/index';
import { loadingPlugins } from './loadingPlugins';
import buildInPlugins from './plugins';
import { output, readConfigFile, readTranslateKeyFile } from './io';
import { filterTranslateKeyFile } from './filterTranslateKeyFile';
import { handleConfigParams as validateConfigParams } from './validateConfigParams';
import { logMessages } from './utils';
import { LOG_TYPE } from './constants';

const defaultOptions = {
  jsx: ts.JsxEmit.ReactJSX,
};
const shaking = async (results: string[], configParams: ConfigParams) => {
  const findKeys: FindKeys = Array.from(new Set(results));
  const translateKeyFileData = await readTranslateKeyFile(configParams);
  const filterTranslateKeyFileData = filterTranslateKeyFile(
    findKeys,
    translateKeyFileData
  );
  output(filterTranslateKeyFileData, configParams!);
};
/**
 * 运行plugins
 * @param file 入口文件
 * @param allPlugins 所有plugins
 * @param configParams 配置信息数据
 * @param options ts配置
 * @returns
 */
function runPlugins(
  file: string[],
  allPlugins: PluginType[],
  configParams: ConfigParams,
  options?: ts.CompilerOptions
) {
  const program = ts.createProgram(
    file,
    Object.assign(defaultOptions, options)
  );

  const sourceFiles = program.getSourceFiles().filter((sourceFile) => {
    return !sourceFile.isDeclarationFile;
  });

  const results: string[] = [];
  const errors: string[] = [];
  const fits: string[] = [];
  let currentSourceFilePlugins: PluginType[] = [];
  let currentSourceFile: ts.SourceFile | null = null;

  sourceFiles.forEach((sourceFile) => {
    currentSourceFile = sourceFile;
    currentSourceFilePlugins = [];
    // 遍历 sourceFile 子节点，过滤无用 plugin
    // 遍历 sourceFile 所有节点，匹配解析翻译文案
    ts.forEachChild(sourceFile, filterPlugins);
    ts.forEachChild(sourceFile, visit);
    currentSourceFilePlugins.forEach((plugin) => {
      fits.length = 0;
      fits.push(...plugin.getImportNames());

      plugin.clear();
    });
  });

  function filterPlugins(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      allPlugins.forEach((plugin) => {
        if (
          plugin.isFit(
            node,
            currentSourceFile!,
            configParams.importInfos || []
          ) &&
          !currentSourceFilePlugins.includes(plugin)
        ) {
          currentSourceFilePlugins.push(plugin);
        }
      });
    }
  }

  function visit(node: ts.Node) {
    currentSourceFilePlugins.forEach((plugin) => {
      const { results: singleNodeParseResults, errors: singleNodeParseErrors } =
        plugin.parse(node, currentSourceFile!, program);
      results.push(...singleNodeParseResults);
      errors.push(...singleNodeParseErrors);
    });
    ts.forEachChild(node, visit);
  }

  return { results, errors, fits };
}
export async function i18nShaking(
  file: string[],
  options?: ts.CompilerOptions
) {
  // 读取参数 (先以配置文件为主，后面整合cli参数)
  // 校验参数
  // 读取校验 plugin
  // 创建 ts program，获取非声明文件的 sourceFile 集合
  // 遍历 sourceFile，调用 plugin 依次进行处理
  // 获取所有遍历到的 keys
  // 读取翻译文件，进行过滤
  // 输出过后的翻译 key 以及 warning & errors 输出
  const configParams = await readConfigFile();
  const { status, validateErrors, handleConfigParams } =
    await validateConfigParams(configParams);
  if (!status) {
    logMessages(validateErrors, LOG_TYPE.ERROR);
    return;
  }
  const allPlugins: PluginType[] = loadingPlugins(buildInPlugins);
  const { results } = runPlugins(file, allPlugins, configParams!, options);

  shaking(results, configParams!);
}

export async function i18nShakingForTest(
  file: string[],
  options?: ts.CompilerOptions
) {
  const allPlugins: PluginType[] = loadingPlugins(buildInPlugins);
  const configParam = {
    entry: '',
    translateFileDirectoryPath: '',
    translateFileName: [''],
    output: '',
    importInfos: [
      { name: 'i18n', path: '' },
      { name: 'trans', path: 'i18nt' },
      { name: '', path: 'i18n' },
      { name: 't', path: 'i18n' },
    ],
  };
  return await runPlugins(file, allPlugins, configParam, options);
}
