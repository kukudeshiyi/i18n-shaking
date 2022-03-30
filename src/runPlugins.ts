import ts from 'typescript';
import { PluginType, ConfigParams, LogData } from './types';
import { LOG_TYPE } from './constants';
import { logMessages } from './utils';

export function runPlugins(
  allPlugins: PluginType[],
  configParams: ConfigParams,
  options?: ts.CompilerOptions
) {
  const { entry, keyWhiteList } = configParams;
  const program = ts.createProgram(entry, options || {});

  const sourceFiles = program.getSourceFiles().filter((sourceFile) => {
    return (
      !sourceFile.isDeclarationFile &&
      !sourceFile.fileName.includes('node_modules')
    );
  });

  const sourceFilesInfo: LogData['sourceFilesInfo'] = [];

  const results: string[] = [...keyWhiteList];
  const warnings: string[] = [];
  const fits: string[] = []; //适用于当前模块的变量名集合
  let currentSourceFilePlugins: PluginType[] = [];
  let currentSourceFile: ts.SourceFile | null = null;
  let currentResultLength = results.length;
  let currentWarningsLength = warnings.length;

  sourceFiles.forEach((sourceFile) => {
    currentResultLength = results.length;
    currentWarningsLength = warnings.length;
    currentSourceFile = sourceFile;
    currentSourceFilePlugins = [];

    ts.forEachChild(sourceFile, filterPlugins);
    ts.forEachChild(sourceFile, visit);

    sourceFilesInfo.push({
      keys: results.slice(currentResultLength),
      warnings: warnings.slice(currentWarningsLength),
      sourceFile:
        currentSourceFile?.fileName || 'not_found_sourcefile_name_please_check',
    });

    currentSourceFilePlugins.forEach((plugin) => {
      fits.length = 0;
      fits.push(...(plugin?.getImportNames?.() || []));
      plugin.afterEachSourceFile?.();
    });
  });

  function filterPlugins(node: ts.Node) {
    allPlugins.forEach((plugin) => {
      if (
        plugin.isFit(node, currentSourceFile!, configParams.pattern || []) &&
        !currentSourceFilePlugins.includes(plugin)
      ) {
        currentSourceFilePlugins.push(plugin);
      }
    });
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

  const handleResult = Array.from(new Set(results));

  return {
    results: handleResult,
    warnings,
    fits,
    sourceFiles,
    sourceFilesInfo,
  };
}
