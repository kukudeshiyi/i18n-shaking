import ts from "typescript";
import { PluginType } from "../types/index";
const EXPRESSION_NODE_ESCAPED_TEXT = "i18n";
const NAME_NODE_ESCAPED_TEXT = "t";
const ERROR_MSG_ONE =
  "The parameters of the i18n.t function are not completely static string literals and cannot be completely statically analyzed. Please check and add them manually";
const ERROR_MSG_TWO =
  "Existence of ternary expression non-static string literal, please check and add manually";

function createErrorMessage(
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

export default function parseI18nPointT(): PluginType {
  return {
    isFit: (node: ts.Node, sourceFile: ts.SourceFile) => {
      try {
        const isCallExpression = ts.isCallExpression(node);
        if (!isCallExpression) {
          return false;
        }

        const callExpressionExpressionNode = node.expression;
        const isPropertyAccessExpression = ts.isPropertyAccessExpression(
          callExpressionExpressionNode
        );
        if (!isPropertyAccessExpression) {
          return false;
        }

        const expressionNode = callExpressionExpressionNode.expression;
        const nameNode = callExpressionExpressionNode.name;
        const expressionNodeIsIdentifier = ts.isIdentifier(expressionNode);
        const nameNodeIsIdentifier = ts.isIdentifier(nameNode);
        if (!expressionNodeIsIdentifier || !nameNodeIsIdentifier) {
          return false;
        }

        if (
          expressionNode.escapedText !== EXPRESSION_NODE_ESCAPED_TEXT ||
          nameNode.escapedText !== NAME_NODE_ESCAPED_TEXT
        ) {
          return false;
        }

        return true;
      } catch (e) {
        return false;
      }
    },
    parse: (node: ts.Node, sourceFile: ts.SourceFile) => {
      try {
        const results: string[] = [];
        const errors: string[] = [];

        const callExpressionParams = (node as ts.CallExpression).arguments;
        const firstParamNode = callExpressionParams[0];

        if (ts.isStringLiteral(firstParamNode)) {
          results.push(firstParamNode.text);
        }

        if (ts.isConditionalExpression(firstParamNode)) {
          const trueResultNode = firstParamNode.whenTrue;
          const falseResultNode = firstParamNode.whenFalse;

          if (ts.isStringLiteral(trueResultNode)) {
            results.push(trueResultNode.text);
          } else {
            errors.push(createErrorMessage(node, sourceFile, ERROR_MSG_TWO));
          }

          if (ts.isStringLiteral(falseResultNode)) {
            results.push(falseResultNode.text);
          } else {
            errors.push(createErrorMessage(node, sourceFile, ERROR_MSG_TWO));
          }
        }

        if (results.length <= 0 && errors.length <= 0) {
          errors.push(createErrorMessage(node, sourceFile, ERROR_MSG_ONE));
        }

        return {
          results,
          errors,
        };
      } catch (e) {
        return {
          results: [],
          errors: [],
        };
      }
    },
  };
}
