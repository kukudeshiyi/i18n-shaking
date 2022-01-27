import ts from 'typescript';
export interface PluginParseReturnValueType {
  results: string[];
  errors: string[];
}
export interface PluginType {
  isFit: (node: ts.Node, sourceFile: ts.SourceFile) => boolean;
  parse: (
    node: ts.Node,
    sourceFile: ts.SourceFile,
    program: ts.Program
  ) => PluginParseReturnValueType;
}
