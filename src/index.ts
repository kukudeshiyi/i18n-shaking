import ts from 'typescript';
import { EXPRESSION_NODE_ESCAPED_TEXT, PluginType } from './types/index';
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
  let isOneSource = true;
  let tag = EXPRESSION_NODE_ESCAPED_TEXT;

  sourceFiles.forEach((sourceFile) => {
    currentSourceFile = sourceFile;
    isOneSource = true;
    tag = EXPRESSION_NODE_ESCAPED_TEXT;
    ts.forEachChild(sourceFile, visit);
  });

  function visit(node: ts.Node) {
    plugins.forEach((plugin) => {
      const { getFunctionName, isFit, parse } = plugin;
      if (currentSourceFile && isOneSource) {
        const res = getFunctionName(node, currentSourceFile);
        if (res) {
          tag = res;
          isOneSource = false;
        }
      }

      if (currentSourceFile && isFit(node, currentSourceFile, tag)) {
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
