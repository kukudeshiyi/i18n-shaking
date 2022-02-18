import ts from 'typescript';
export interface PluginParseReturnValueType {
  results: string[];
  errors: string[];
}
export interface PluginType {
  isFit: (
    node: ts.Node,
    sourceFile: ts.SourceFile,
    importInfos: ImportInfos[]
  ) => boolean;
  parse: (
    node: ts.Node,
    sourceFile: ts.SourceFile,
    program: ts.Program
  ) => PluginParseReturnValueType;
  getImportNames: () => string[];
  clear: () => void;
}

export interface ImportInfos {
  name: string;
  path?: string;
}
export interface ConfigParams {
  entry: string;
  translateFileDirectoryPath: string;
  translateFileName: string[];
  output: string;
  importInfos?: ImportInfos[];
}
export interface TranslateKeyFileData {
  [key: string]: string;
}

export type FindKeys = Array<String>;
