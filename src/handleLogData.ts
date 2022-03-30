import { LogData, ConfigParams } from './types';
import ts from 'typescript';

export function handleLogData(
  configParams: ConfigParams,
  sourceFiles: ts.SourceFile[],
  warnings: string[],
  sourceFilesInfo: LogData['sourceFilesInfo'],
  parseResults: string[],
  outputResults: string[]
): LogData {
  const { keyWhiteList } = configParams;
  return {
    sourceFiles: sourceFiles.map((sourceFile) => sourceFile.fileName),
    warnings,
    sourceFilesInfo,
    keyWhiteList,
    parseResults,
    outputResults,
    compareResults: compareParseResultsAndOutputResults(
      parseResults,
      outputResults
    ),
  };
}

function compareParseResultsAndOutputResults(
  parseResults: string[],
  outputResults: string[]
) {
  const result: string[] = [];
  if (outputResults.length < parseResults.length) {
    parseResults.forEach((item) => {
      !outputResults.includes(item) && result.push(item);
    });
  }
  return result;
}
