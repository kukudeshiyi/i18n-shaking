import ts from 'typescript';
import { PATH_TYPE, FRAME } from '../constants';
export interface PluginParseReturnValueType {
  results: string[];
  warnings: string[];
}
export interface PluginType {
  isFit: (
    node: ts.Node,
    sourceFile: ts.SourceFile,
    pattern: Pattern[]
  ) => boolean;
  parse: (
    node: ts.Node,
    sourceFile: ts.SourceFile,
    program: ts.Program
  ) => PluginParseReturnValueType;
  getImportNames?: () => string[];
  afterEachSourceFile?: () => void;
}

export interface Pattern {
  name: string;
  path?: string;
}
export interface ConfigParams {
  entry: string[];
  translateFileDirectoryPath: string;
  translateFileNames: string[];
  output: string;
  pattern?: Pattern[];
  frame: FRAME;
  keyWhiteList: string[];
}
export interface TranslateKeyFileData {
  [key: string]: unknown;
}

export type FindKeys = Array<string>;

export interface HandlePathOptions {
  expect: PATH_TYPE;
  rootPath?: string;
}

export interface LoggerData {
  sourceFileNames: string[];
  warnings: string[];
}

export interface ImportDeclarationNodeInfo {
  moduleNames: Array<{
    moduleName: string;
    moduleAsName?: string;
  }>;
  path: string;
}

export interface LogData {
  sourceFiles: string[];
  warnings: string[];
  keyWhiteList: string[];
  parseResults: string[];
  outputResults: string[];
  compareResults: string[];
  sourceFilesInfo: Array<{
    warnings: string[];
    keys: string[];
    sourceFile: string;
  }>;
}
