import ts from 'typescript';
import { PluginType, ConfigParams } from './types/index';
const defaultOptions = {
  jsx: ts.JsxEmit.ReactJSX,
};

export function runPlugins(
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
