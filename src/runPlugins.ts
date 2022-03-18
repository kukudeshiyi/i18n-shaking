import ts from 'typescript';
import { PluginType, ConfigParams } from './types/index';
import { FRAME, LOG_TYPE } from './constants';
import { logMessages } from './utils';

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

export function runPlugins(
  allPlugins: PluginType[],
  configParams: ConfigParams,
  options?: ts.CompilerOptions
) {
  const { entry, frame, keyWhiteList } = configParams;
  const program = ts.createProgram(
    entry,
    Object.assign(getDefaultOptions(frame), options)
  );

  const sourceFiles = program.getSourceFiles().filter((sourceFile) => {
    return (
      !sourceFile.isDeclarationFile &&
      !sourceFile.fileName.includes('node_modules')
    );
  });

  const results: string[] = [...keyWhiteList];
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

  if (results.length <= 0) {
    logMessages(
      ['The static analysis result is empty, please check the configuration'],
      LOG_TYPE.ERROR
    );
  }

  return { results, warnings, fits, sourceFiles };
}
