import ts from 'typescript';
export interface PluginParseReturnValueType {
  results: string[];
  errors: string[];
}
export interface PluginType {
  getFunctionName: (node: ts.Node, sourceFile: ts.SourceFile) => string | null;
  isFit: (node: ts.Node, sourceFile: ts.SourceFile, tag: string) => boolean;
  parse: (
    node: ts.Node,
    sourceFile: ts.SourceFile,
    program: ts.Program
  ) => PluginParseReturnValueType;
}

export const EXPRESSION_NODE_ESCAPED_TEXT = 'i18n';
