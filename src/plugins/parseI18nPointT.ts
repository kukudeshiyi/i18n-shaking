//@ts-nocheck
import ts, { NamedImports, NamespaceImport } from 'typescript';
import { Pattern, PluginType } from '../types/index';
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

export default function parseI18nPointT(): PluginType {
  const importIdentifierName: string[] = [];
  return {
    isFit: (node: ts.Node, sourceFile: ts.SourceFile, pattern) => {
      if (!(ts.isImportDeclaration(node) || ts.isVariableDeclaration(node))) {
        return false;
      }

      pattern
        .sort((a, b) => {
          if (a.path && !b.path) {
            return -1;
          }
          return 1;
        })
        .sort((a, b) => {
          if (a.name && !b.name) {
            return -1;
          }
          return 1;
        });

      const getI18nFunctionName = (node2: ts.Node): string => {
        const dealWithName = (
          _node: ts.ImportDeclaration,
          _element: Pattern
        ) => {
          if (_node.importClause?.namedBindings) {
            try {
              for (const elementValue of (
                _node.importClause?.namedBindings as NamedImports
              )?.elements) {
                // like import {i18n as trans}
                if (elementValue.propertyName?.escapedText === _element.name) {
                  return elementValue.name?.escapedText as string;
                }
                // like import {i18n}
                if (elementValue.name?.escapedText === _element.name) {
                  return elementValue.name?.escapedText;
                }
              }
              return (_node.importClause?.namedBindings as NamespaceImport).name
                ?.escapedText;
            } catch (error) {}
          }
          if (_node.importClause?.name) {
            // 默认导出
            if (_node.importClause?.name?.escapedText === _element.name) {
              return _node.importClause?.name?.escapedText as string;
            }
          }
        };
        if (ts.isImportDeclaration(node2)) {
          if (pattern && pattern.length > 0) {
            for (let index = 0; index < pattern.length; index++) {
              const element = pattern[index];

              // 有path和name
              if (element.path && element.name) {
                // TODO:
                if (node2.moduleSpecifier.text === element.path) {
                  const res = dealWithName(node2, element);
                  if (res) return res;
                }
                continue;
              }
              // 只有path [{name:'',path:'i18n'}] import trans from 'i18n
              if (element.path) {
                // FIXME:根据path寻找
                if (node2.moduleSpecifier.text === element.path) {
                  const res = node2.importClause?.namedBindings
                    ? (node2.importClause?.namedBindings as NamespaceImport)
                        .name?.escapedText
                    : node2.importClause?.name?.escapedText;
                  return res as string;
                }
                continue;
              }
              // 只有name
              if (element.name) {
                const res = dealWithName(node2, element);
                if (res) return res;
                continue;
              }
            }
          }
        }
        return '';
      };
      const funcName = getI18nFunctionName(node);

      const getDeconstruct = (node2: ts.Node): string => {
        if (ts.isVariableDeclaration(node2)) {
          const i18nFuncName =
            node2.initializer?.escapedText ||
            node2.initializer?.expression?.escapedText;

          if (importIdentifierName.indexOf(i18nFuncName) >= 0) {
            let res = '';
            // like const trans = i18n()
            if (node2.name.escapedText) {
              res = node2.name.escapedText;
            }
            // like const { t,s } = i18n();
            if (node2.name.elements) {
              const element = node2.name.elements.find(
                (_element) =>
                  _element.name.escapedText === NAME_NODE_ESCAPED_TEXT
              );

              element && (res = element.name.escapedText);
            }
            return res;
          }

          return '';
        }
        return '';
      };
      const deconstructName = getDeconstruct(node);
      if (funcName || deconstructName) {
        importIdentifierName.push(funcName || deconstructName);
        return true;
      }
      if (importIdentifierName.length > 0) {
        return true;
      }
      return false;
    },
    parse: (node: ts.Node, sourceFile: ts.SourceFile, program) => {
      const isI18nCall = () => {
        try {
          const isCallExpression = ts.isCallExpression(node);
          if (!isCallExpression) {
            return false;
          }

          const callExpressionExpressionNode = node.expression;

          const isPropertyAccessExpression = ts.isPropertyAccessExpression(
            callExpressionExpressionNode
          );
          // i18n()
          if (!isPropertyAccessExpression) {
            if (!ts.isIdentifier(callExpressionExpressionNode)) {
              return false;
            }
            if (
              importIdentifierName.includes(
                callExpressionExpressionNode.escapedText as string
              )
            ) {
              return true;
            }
          }
          // i18n.t()
          const expressionNode = callExpressionExpressionNode.expression;
          const nameNode = callExpressionExpressionNode.name;
          const expressionNodeIsIdentifier = ts.isIdentifier(expressionNode);
          const nameNodeIsIdentifier = ts.isIdentifier(nameNode);
          if (!expressionNodeIsIdentifier || !nameNodeIsIdentifier) {
            return false;
          }

          if (
            !importIdentifierName.includes(
              expressionNode.escapedText as string
            ) ||
            nameNode.escapedText !== NAME_NODE_ESCAPED_TEXT
          ) {
            return false;
          }

          return true;
        } catch (e) {
          return false;
        }
      };

      if (!isI18nCall()) {
        return {
          results: [],
          warnings: [],
        };
      }

      const results: string[] = [];
      const warnings: string[] = [];
      const callExpressionParams = (node as ts.CallExpression).arguments;

      if (callExpressionParams.length === 0) {
        return {
          results: [],
          warnings: [],
        };
      }
      const firstParamNode = callExpressionParams[0];
      const typeChecker = program.getTypeChecker();
      //case 1 字符串变量
      if (ts.isStringLiteral(firstParamNode)) {
        results.push(firstParamNode.text);
      }

      //case 2 三元表达式
      if (ts.isConditionalExpression(firstParamNode)) {
        const trueResultNode = firstParamNode.whenTrue;
        const falseResultNode = firstParamNode.whenFalse;

        if (ts.isStringLiteral(trueResultNode)) {
          results.push(trueResultNode.text);
        } else {
          warnings.push(createErrorMessage(node, sourceFile, ERROR_MSG_TWO));
        }

        if (ts.isStringLiteral(falseResultNode)) {
          results.push(falseResultNode.text);
        } else {
          warnings.push(createErrorMessage(node, sourceFile, ERROR_MSG_TWO));
        }
      }

      //case 3 字符串模版拼接
      if (ts.isTemplateExpression(firstParamNode)) {
        const strArray = [];
        strArray.push(firstParamNode.head.text);

        firstParamNode.templateSpans.forEach((span) => {
          const type = typeChecker.getTypeAtLocation(span.expression);

          if (type.isLiteral()) {
            strArray.push(type.value);
          }
          strArray.push(span.literal.text);
        });

        results.push(strArray.join(''));
      }

      //case 4 字符串拼接
      if (ts.isBinaryExpression(firstParamNode)) {
        const text = stringConcatenation(firstParamNode, '');
        results.push(text);
      }

      if (results.length <= 0 && warnings.length <= 0) {
        warnings.push(createErrorMessage(node, sourceFile, ERROR_MSG_ONE));
      }
      return {
        results,
        warnings,
      };
    },
    getImportNames: (): string[] => {
      return importIdentifierName;
    },
    afterEachSourceFile: () => {
      importIdentifierName.length = 0;
    },
  };
}
