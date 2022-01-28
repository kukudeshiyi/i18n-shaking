import ts from 'typescript';
import { PluginType } from './types/index';
import parseI18nPointT from './plugins/parseI18nPointT';

const defaultOptions = {
  jsx: ts.JsxEmit.ReactJSX,
};

export function i18nShaking(file: string[], options?: ts.CompilerOptions) {
  const plugins = [parseI18nPointT].reduce(
    (pluginsArr: Array<PluginType>, pluginFactory: unknown) => {
      if (typeof pluginFactory === 'function') {
        const plugin = pluginFactory();
        if (
          typeof plugin.isFit === 'function' &&
          typeof plugin.parse === 'function'
        ) {
          pluginsArr.push(plugin);
        }
      }
      return pluginsArr;
    },
    []
  );

  const program = ts.createProgram(
    file,
    Object.assign(defaultOptions, options)
  );
  const sourceFiles = program.getSourceFiles().filter((sourceFile) => {
    return !sourceFile.isDeclarationFile;
  });

  const results: string[] = [];
  const errors: string[] = [];
  let currentSourceFile: ts.SourceFile | null = null;

  sourceFiles.forEach((sourceFile) => {
    currentSourceFile = sourceFile;
    ts.forEachChild(sourceFile, visit);
  });

  function visit(node: ts.Node) {
    plugins.forEach((plugin) => {
      const { isFit, parse } = plugin;
      if (currentSourceFile && isFit(node, currentSourceFile)) {
        const {
          results: singleNodeParseResults,
          errors: singleNodeParseErrors,
        } = parse(node, currentSourceFile, program);
        results.push(...singleNodeParseResults);
        errors.push(...singleNodeParseErrors);
      }
    });
    ts.forEachChild(node, visit);
  }

  const handleResults = Array.from(new Set(results));

  return {
    handleResults,
    errors,
  };
}
