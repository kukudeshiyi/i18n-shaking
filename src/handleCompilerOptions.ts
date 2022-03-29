import ts from 'typescript';
import { ConfigParams } from './types/index';
import { FRAME } from './constants';

function getFrameOption(frame: FRAME) {
  switch (frame) {
    case FRAME.REACT_NATIVE:
      return {
        jsx: ts.JsxEmit.ReactNative,
      };
    case FRAME.REACT:
    default:
      return {
        jsx: ts.JsxEmit.ReactJSX,
      };
  }
}
export function handleCompilerOptions(
  compilerOptions: ts.CompilerOptions,
  configParams: ConfigParams
): ts.CompilerOptions {
  const { frame } = configParams;
  const paths = compilerOptions.paths;
  return {
    paths,
    ...getFrameOption(frame),
  };
}
