import { TS_CONFIG_FILE_NAME } from '../constants';
import path from 'path';
import fs from 'fs';
import ts from 'typescript';

export async function readTsConfig(
  tsConfigFilePath?: string
): Promise<ts.CompilerOptions> {
  try {
    const currentExecPath = process.cwd();
    tsConfigFilePath =
      tsConfigFilePath || path.join(currentExecPath, TS_CONFIG_FILE_NAME);
    const tsConfigContent = await fs.promises
      .readFile(tsConfigFilePath, 'utf8')
      .catch((e) => {
        return JSON.stringify({});
      });
    const compilerOptions = JSON.parse(tsConfigContent).compilerOptions || {};
    return compilerOptions;
  } catch (e) {
    return {};
  }
}
