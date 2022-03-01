import ts from 'typescript';
import { PATH_TYPE } from '../constants';
export interface PluginParseReturnValueType {
  //结果集合
  results: string[];
  //未识别集合
  warnings: string[];
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
  afterEachSourceFile?: () => void;
}

export interface ImportInfos {
  name: string;
  path?: string;
}
export interface ConfigParams {
  entry: string;
  translateFileDirectoryPath: string;
  translateFileNames: string[];
  output: string;
  importInfos?: ImportInfos[];
}
export interface TranslateKeyFileData {
  [key: string]: string;
}

export type FindKeys = Array<string>;

export interface HandlePathOptions {
  expect: PATH_TYPE;
  rootPath?: string;
}
