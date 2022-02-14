import ts from 'typescript';
import { EXPRESSION_NODE_ESCAPED_TEXT, PluginType } from './types/index';
import buildInPlugins from './plugins';

const defaultOptions = {
  jsx: ts.JsxEmit.ReactJSX,
};

function loadingPlugins(plugins: Array<() => PluginType>) {
  return plugins.reduce(
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
}

export function i18nShaking(file: string[], options?: ts.CompilerOptions) {
  const allPlugins: PluginType[] = loadingPlugins(buildInPlugins);
  const results: string[] = [];
  const errors: string[] = [];
  let currentSourceFilePlugins: PluginType[] = [];
  let currentSourceFile: ts.SourceFile | null = null;

  const program = ts.createProgram(
    file,
    Object.assign(defaultOptions, options)
  );
  const sourceFiles = program.getSourceFiles().filter((sourceFile) => {
    return !sourceFile.isDeclarationFile;
  });

  sourceFiles.forEach((sourceFile) => {
    currentSourceFile = sourceFile;
    currentSourceFilePlugins = [];
    // 遍历 sourceFile 子节点，过滤无用 plugin
    // 遍历 sourceFile 所有节点，匹配解析翻译文案
    ts.forEachChild(sourceFile, filterPlugins);
    ts.forEachChild(sourceFile, visit);
  });

  function filterPlugins(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      allPlugins.forEach((plugin) => {
        if (
          plugin.isFit(node, currentSourceFile!) &&
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

  const handleResults = Array.from(new Set(results));

  return {
    handleResults,
    errors,
  };
}
