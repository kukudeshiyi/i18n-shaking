import ts from 'typescript';
export function createErrorMessage(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  errorMessage: string
) {
  const { line, character } = ts.getLineAndCharacterOfPosition(
    sourceFile,
    node.getStart(sourceFile)
  );
  return `${sourceFile.fileName} (${line + 1},${
    character + 1
  }) ${errorMessage}`;
}
