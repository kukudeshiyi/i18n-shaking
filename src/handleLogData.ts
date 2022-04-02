import { LogData, ConfigParams, TranslateKeyFileData } from './types';
import ts from 'typescript';

export function handleLogData(
  configParams: ConfigParams,
  sourceFiles: ts.SourceFile[],
  warnings: string[],
  sourceFilesInfo: LogData['sourceFilesInfo'],
  parseResults: string[],
  filterTranslateKeyFileData: TranslateKeyFileData[]
): LogData {
  const { keyWhiteList } = configParams;
  const outputResults = Object.keys(filterTranslateKeyFileData[0]);
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
