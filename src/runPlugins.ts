import ts from 'typescript';
import { PluginType, ConfigParams } from './types/index';
import { FRAME } from './constants';

const getDefaultOptions = (frame: FRAME) => {
  switch (frame) {
    case FRAME.REACT_NATIVE:
      return {
        jsx: ts.JsxEmit.ReactNative,
      };
    case FRAME.REACT:
    default:
      return {
        jsx: ts.JsxEmit.ReactJSX,
      };
  }
};

/**
 * 运行插件
 * @param file 入口文件
 * @param allPlugins 插件列表
 * @param configParams 配置信息
 * @param options ts配置
 * @returns [Object] { results:结果集合, warnings:未识别集合, fits:适用于当前模块的变量名集合 }
 */
export function runPlugins(
  file: string[],
  allPlugins: PluginType[],
  configParams: ConfigParams,
  options?: ts.CompilerOptions
) {
  const { entry, frame } = configParams;
  const program = ts.createProgram(
    entry ? [entry] : file,
    Object.assign(getDefaultOptions(frame), options)
  );

  const sourceFiles = program.getSourceFiles().filter((sourceFile) => {
    return !sourceFile.isDeclarationFile;
  });

  const results: string[] = [];
  const warnings: string[] = [];
  const fits: string[] = []; //适用于当前模块的变量名集合
  let currentSourceFilePlugins: PluginType[] = [];
  let currentSourceFile: ts.SourceFile | null = null;

  sourceFiles.forEach((sourceFile) => {
    currentSourceFile = sourceFile;
    currentSourceFilePlugins = [];
    ts.forEachChild(sourceFile, filterPlugins);
    ts.forEachChild(sourceFile, visit);
    currentSourceFilePlugins.forEach((plugin) => {
      fits.length = 0;
      fits.push(...plugin.getImportNames());
      plugin.afterEachSourceFile?.();
    });
  });

  function filterPlugins(node: ts.Node) {
    if (ts.isImportDeclaration(node) || ts.isVariableDeclaration(node)) {
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
    ts.forEachChild(node, filterPlugins);
  }

  function visit(node: ts.Node) {
    currentSourceFilePlugins.forEach((plugin) => {
      const {
        results: singleNodeParseResults,
        warnings: singleNodeParseWarnings,
      } = plugin.parse(node, currentSourceFile!, program);
      results.push(...singleNodeParseResults);
      warnings.push(...singleNodeParseWarnings);
    });
    ts.forEachChild(node, visit);
  }

  return { results, warnings, fits };
}
