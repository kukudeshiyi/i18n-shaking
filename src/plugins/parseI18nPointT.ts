import ts from 'typescript';
import { PluginType } from '../types/index';

const EXPRESSION_NODE_ESCAPED_TEXT = 'i18n';
const NAME_NODE_ESCAPED_TEXT = 't';
const ERROR_MSG_ONE =
  'The parameters of the i18n.t function are not completely static string literals and cannot be completely statically analyzed. Please check and add them manually';
const ERROR_MSG_TWO =
  'Existence of ternary expression non-static string literal, please check and add manually';

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

function stringConcatenation(
  paramNode: ts.BinaryExpression,
  res: string
): string {
  if (ts.isStringLiteral(paramNode.left)) {
    if (ts.isStringLiteral(paramNode.right)) {
      return paramNode.left.text + paramNode.right.text;
    }
  } else if (ts.isBinaryExpression(paramNode.left)) {
    if (ts.isStringLiteral(paramNode.right)) {
      return stringConcatenation(paramNode.left, res) + paramNode.right.text;
    }
  }

  return '';
}

// export default function parseI18nPointT(): PluginType {
//   return {
//     getFunctionName: (node: ts.Node, sourceFile: ts.SourceFile) => {
//       if (ts.isImportDeclaration(node)) {
//         if (node.moduleSpecifier.text === EXPRESSION_NODE_ESCAPED_TEXT) {
//           const res = node.importClause?.namedBindings
//             ? node.importClause?.namedBindings.name.escapedText
//             : node.importClause?.name.escapedText;
//           return res;
//         }
//       }
//       return null;
//     },
//     isFit: (node: ts.Node, sourceFile: ts.SourceFile, tag: string) => {
//       try {
//         const isCallExpression = ts.isCallExpression(node);
//         if (!isCallExpression) {
//           return false;
//         }

//         const callExpressionExpressionNode = node.expression;
//         const isPropertyAccessExpression = ts.isPropertyAccessExpression(
//           callExpressionExpressionNode
//         );
//         if (!isPropertyAccessExpression) {
//           return false;
//         }

//         const expressionNode = callExpressionExpressionNode.expression;
//         const nameNode = callExpressionExpressionNode.name;
//         const expressionNodeIsIdentifier = ts.isIdentifier(expressionNode);
//         const nameNodeIsIdentifier = ts.isIdentifier(nameNode);
//         if (!expressionNodeIsIdentifier || !nameNodeIsIdentifier) {
//           return false;
//         }

//         if (
//           expressionNode.escapedText !== tag ||
//           nameNode.escapedText !== NAME_NODE_ESCAPED_TEXT
//         ) {
//           return false;
//         }

//         return true;
//       } catch (e) {
//         return false;
//       }
//     },
//     parse: (node: ts.Node, sourceFile: ts.SourceFile, program: ts.Program) => {
//       // try {
//       const results: string[] = [];
//       const errors: string[] = [];

//       const callExpressionParams = (node as ts.CallExpression).arguments;
//       const firstParamNode = callExpressionParams[0];
//       const typeChecker = program.getTypeChecker();

//       //case 1 字符串变量
//       if (ts.isStringLiteral(firstParamNode)) {
//         results.push(firstParamNode.text);
//       }

//       //case 2 三元表达式
//       if (ts.isConditionalExpression(firstParamNode)) {
//         const trueResultNode = firstParamNode.whenTrue;
//         const falseResultNode = firstParamNode.whenFalse;

//         if (ts.isStringLiteral(trueResultNode)) {
//           results.push(trueResultNode.text);
//         } else {
//           errors.push(createErrorMessage(node, sourceFile, ERROR_MSG_TWO));
//         }

//         if (ts.isStringLiteral(falseResultNode)) {
//           results.push(falseResultNode.text);
//         } else {
//           errors.push(createErrorMessage(node, sourceFile, ERROR_MSG_TWO));
//         }
//       }

//       //case 3 字符串模版拼接
//       if (ts.isTemplateExpression(firstParamNode)) {
//         const strArray = [];
//         strArray.push(firstParamNode.head.text);

//         firstParamNode.templateSpans.forEach((span) => {
//           const type = typeChecker.getTypeAtLocation(span.expression);

//           if (type.isLiteral()) {
//             strArray.push(type.value);
//           }
//           strArray.push(span.literal.text);
//         });

//         results.push(strArray.join(''));
//       }

//       //case 4 字符串拼接
//       if (ts.isBinaryExpression(firstParamNode)) {
//         const text = stringConcatenation(firstParamNode, '');
//         results.push(text);
//       }

//       if (results.length <= 0 && errors.length <= 0) {
//         errors.push(createErrorMessage(node, sourceFile, ERROR_MSG_ONE));
//       }

//       return {
//         results,
//         errors,
//       };
//       // } catch (e) {
//       //   return {
//       //     results: [],
//       //     errors: [],
//       //   };
//       // }
//     },
//   };
// }

export default function parseI18nPointT(): PluginType {
  const importIdentifierName: string[] = [];
  return {
    isFit: (node: ts.Node, sourceFile: ts.SourceFile) => {
      return false;
    },
    parse: (node: ts.Node, sourceFile: ts.SourceFile) => {
      return {
        results: [],
        errors: [],
      };
    },
  };
}
