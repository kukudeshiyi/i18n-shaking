import ts from 'typescript';
import { Pattern, PluginType, ImportDeclarationNodeInfo } from '../types/index';
import {
  ERROR_MSG_FUNCTION_PARAMS_ERROR,
  ERROR_MSG_TERNARY_EXPRESSION_ERROR,
} from '../constants';
import { createErrorMessage } from '../utils/plugins';

export default function parseI18nPointT(): PluginType {
  const importModuleNames: string[] = [];

  return {
    isFit: (node, _sourceFile, pattern) => {
      pattern = sortPattern(pattern);
      if (ts.isImportDeclaration(node)) {
        importModuleNames.push(
          ...getModuleNames(parseImportDeclaration(node), pattern)
        );
      }

      if (ts.isVariableDeclaration(node)) {
        importModuleNames.push(...getIdentifierNames(node, importModuleNames));
      }

      return !!importModuleNames.length;
    },
    parse: (node, sourceFile, program) => {
      const results: string[] = [];
      const warnings: string[] = [];

      if (!ts.isCallExpression(node) || !canParse(node, importModuleNames)) {
        return {
          results,
          warnings,
        };
      }

      const callExpressionParams = node.arguments;

      callExpressionParams.forEach((param) => {
        const { results: paramResults, warnings: paramWarnings } =
          parseCallExpressionParams(param, sourceFile, program);
        results.push(...paramResults);
        warnings.push(...paramWarnings);
      });

      if (results.length <= 0 && warnings.length <= 0) {
        warnings.push(
          createErrorMessage(node, sourceFile, ERROR_MSG_FUNCTION_PARAMS_ERROR)
        );
      }

      return {
        results,
        warnings,
      };
    },
    getImportNames: (): string[] => {
      return importModuleNames;
    },
    afterEachSourceFile: () => {
      importModuleNames.length = 0;
    },
  };
}

function sortPattern(pattern: Pattern[]) {
  return pattern
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
}

function getModuleNames(
  importDeclarationNodeInfo: ImportDeclarationNodeInfo,
  pattern: Pattern[]
): string[] {
  const { path: modulePath, moduleNames } = importDeclarationNodeInfo;
  const result: string[] = [];
  // TODO: break
  for (const { name: patternName, path: patternPath } of pattern) {
    if (patternName && patternPath && modulePath === patternPath) {
      // TODO: 优化path：寻找路径解析映射的方式
      const targetName = findModuleName(moduleNames, patternName);
      if (!!targetName) {
        result.push(targetName);
        break;
      }
    }

    if (patternPath && modulePath === patternPath) {
      moduleNames.forEach((item) => {
        result.push(item.moduleAsName || item.moduleName);
      });
      break;
    }

    if (patternName) {
      const targetName = findModuleName(moduleNames, patternName);
      if (!!targetName) {
        result.push(targetName);
        break;
      }
    }
  }
  return result;
}

function findModuleName(
  moduleNames: ImportDeclarationNodeInfo['moduleNames'],
  targetName: string
) {
  const target = moduleNames.find((item) => item.moduleName === targetName);
  return !target
    ? ''
    : !!target.moduleAsName
    ? target.moduleAsName
    : target.moduleName;
}

function parseImportDeclaration(
  node: ts.ImportDeclaration
): ImportDeclarationNodeInfo {
  const path = ts.isStringLiteral(node.moduleSpecifier)
    ? node.moduleSpecifier.text
    : '';
  const importClauseNode = node.importClause;
  const moduleNames: ImportDeclarationNodeInfo['moduleNames'] = [];

  if (!importClauseNode || !ts.isImportClause(importClauseNode)) {
    return {
      path,
      moduleNames,
    };
  }

  if (importClauseNode.name) {
    moduleNames.push({
      moduleName: importClauseNode.name.escapedText.toString(),
    });
  }

  if (
    importClauseNode.namedBindings &&
    ts.isNamedImports(importClauseNode.namedBindings)
  ) {
    moduleNames.push(
      ...importClauseNode.namedBindings.elements.map((element) => {
        if (element.propertyName) {
          return {
            moduleName: element.propertyName.escapedText.toString(),
            moduleAsName: element.name.escapedText.toString(),
          };
        } else {
          return {
            moduleName: element.name.escapedText.toString(),
          };
        }
      })
    );
  }

  if (
    importClauseNode.namedBindings &&
    ts.isNamespaceImport(importClauseNode.namedBindings)
  ) {
    moduleNames.push({
      moduleName: importClauseNode.namedBindings.name.escapedText.toString(),
    });
  }

  return {
    path,
    moduleNames,
  };
}

function getIdentifierNames(
  node: ts.VariableDeclaration,
  importModuleNames: string[]
) {
  const result: string[] = [];
  const initializerNode = node.initializer;
  let initializerNodeEscapedText = '';

  if (
    !initializerNode ||
    (!ts.isIdentifier(initializerNode) && !ts.isCallExpression(initializerNode))
  ) {
    return result;
  }

  initializerNodeEscapedText = ts.isIdentifier(initializerNode)
    ? initializerNode.escapedText.toString()
    : initializerNodeEscapedText;

  initializerNodeEscapedText =
    ts.isCallExpression(initializerNode) &&
    ts.isIdentifier(initializerNode.expression)
      ? initializerNode.expression.escapedText.toString()
      : initializerNodeEscapedText;

  if (!importModuleNames.includes(initializerNodeEscapedText)) {
    return result;
  }

  const nameNode = node.name;

  if (ts.isIdentifier(nameNode)) {
    result.push(nameNode.escapedText.toString());
  }

  if (ts.isObjectBindingPattern(nameNode)) {
    nameNode.elements.forEach((element) => {
      ts.isIdentifier(element.name) &&
        result.push(element.name.escapedText.toString());
    });
  }

  return result;
}

function canParse(node: ts.CallExpression, importModuleNames: string[]) {
  let flag = false;

  const expressionNode = node.expression;
  if (
    ts.isPropertyAccessExpression(expressionNode) &&
    ts.isIdentifier(expressionNode.expression) &&
    importModuleNames.includes(expressionNode.expression.escapedText.toString())
  ) {
    flag = true;
  }

  if (
    ts.isIdentifier(expressionNode) &&
    importModuleNames.includes(expressionNode.escapedText.toString())
  ) {
    flag = true;
  }

  return flag;
}

function parseCallExpressionParams(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  program: ts.Program
) {
  const results: string[] = [];
  const warnings: string[] = [];
  const typeChecker = program.getTypeChecker();

  //case 1 字符串变量
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    results.push(node.text);
  }

  //case 2 三元表达式
  if (ts.isConditionalExpression(node)) {
    const trueResultNode = node.whenTrue;
    const falseResultNode = node.whenFalse;

    [trueResultNode, falseResultNode].forEach((item) => {
      if (ts.isStringLiteral(item)) {
        results.push(item.text);
      } else {
        warnings.push(
          createErrorMessage(
            item,
            sourceFile,
            ERROR_MSG_TERNARY_EXPRESSION_ERROR
          )
        );
      }
    });
  }

  // case 3 模板字符串变量拼接
  if (ts.isTemplateExpression(node)) {
    const strArray = [];
    strArray.push(node.head.text);

    node.templateSpans.forEach((span) => {
      const type = typeChecker.getTypeAtLocation(span.expression);

      if (type.isLiteral()) {
        strArray.push(type.value);
      }

      strArray.push(span.literal.text);
    });

    results.push(strArray.join(''));
  }

  //case 4 字符串拼接
  if (ts.isBinaryExpression(node)) {
    const { text, warnings } = stringConcatenation(node, sourceFile);
    results.push(text);
    warnings.push(...warnings);
  }

  return {
    results,
    warnings,
  };
}

function stringConcatenation(
  node: ts.BinaryExpression,
  sourceFile: ts.SourceFile
): {
  text: string;
  warnings: string[];
} {
  const leftNode = node.left;
  const rightNode = node.right;

  if (ts.isStringLiteral(leftNode) && ts.isStringLiteral(rightNode)) {
    return {
      text: leftNode.text + rightNode.text,
      warnings: [],
    };
  } else if (ts.isBinaryExpression(leftNode) && ts.isStringLiteral(rightNode)) {
    const { text, warnings } = stringConcatenation(leftNode, sourceFile);
    return {
      text: text + rightNode.text,
      warnings,
    };
  } else {
    return {
      text: '',
      warnings: [
        createErrorMessage(
          node,
          sourceFile,
          ERROR_MSG_TERNARY_EXPRESSION_ERROR
        ),
      ],
    };
  }
}
