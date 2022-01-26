"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = __importDefault(require("typescript"));
var EXPRESSION_NODE_ESCAPED_TEXT = "i18n";
var NAME_NODE_ESCAPED_TEXT = "t";
var ERROR_MSG_ONE = "The parameters of the i18n.t function are not completely static string literals and cannot be completely statically analyzed. Please check and add them manually";
var ERROR_MSG_TWO = "Existence of ternary expression non-static string literal, please check and add manually";
function createErrorMessage(node, sourceFile, errorMessage) {
    var _a = typescript_1.default.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile)), line = _a.line, character = _a.character;
    return sourceFile.fileName + " (" + (line + 1) + "," + (character + 1) + ") " + errorMessage;
}
function parseI18nPointT() {
    return {
        isFit: function (node, sourceFile) {
            // 校验是否是 CallExpression
            // 校验 CallExpression 的 expression 的 name 和 expression 是不是 Identifier 以及 escapedText 是不是 t 和 i18n
            try {
                var isCallExpression = typescript_1.default.isCallExpression(node);
                if (!isCallExpression) {
                    return false;
                }
                var callExpressionExpressionNode = node.expression;
                var isPropertyAccessExpression = typescript_1.default.isPropertyAccessExpression(callExpressionExpressionNode);
                if (!isPropertyAccessExpression) {
                    return false;
                }
                var expressionNode = callExpressionExpressionNode.expression;
                var nameNode = callExpressionExpressionNode.name;
                var expressionNodeIsIdentifier = typescript_1.default.isIdentifier(expressionNode);
                var nameNodeIsIdentifier = typescript_1.default.isIdentifier(nameNode);
                if (!expressionNodeIsIdentifier || !nameNodeIsIdentifier) {
                    return false;
                }
                if (expressionNode.escapedText !== EXPRESSION_NODE_ESCAPED_TEXT ||
                    nameNode.escapedText !== NAME_NODE_ESCAPED_TEXT) {
                    return false;
                }
                return true;
            }
            catch (e) {
                return false;
            }
        },
        parse: function (node, sourceFile) {
            // 已经在 isFit 中完全校验符合i18n.t()，现可直接获取参数进行校验
            // 校验参数是是不是字符字面量，如果是则直接提取字符字面量
            // 校验参数是不是三元表达式，如果是则提取两个结果中的字符字面量，如果存在不为字符字面量的节点，则要记录到错误日志中
            // 如果为其他节点则，直接记录到错误日志中，供用户手动检查
            try {
                var results = [];
                var errors = [];
                var callExpressionParams = node.arguments;
                var firstParamNode = callExpressionParams[0];
                if (typescript_1.default.isStringLiteral(firstParamNode)) {
                    results.push(firstParamNode.text);
                }
                if (typescript_1.default.isConditionalExpression(firstParamNode)) {
                    var trueResultNode = firstParamNode.whenTrue;
                    var falseResultNode = firstParamNode.whenFalse;
                    if (typescript_1.default.isStringLiteral(trueResultNode)) {
                        results.push(trueResultNode.text);
                    }
                    else {
                        errors.push(createErrorMessage(node, sourceFile, ERROR_MSG_TWO));
                    }
                    if (typescript_1.default.isStringLiteral(falseResultNode)) {
                        results.push(falseResultNode.text);
                    }
                    else {
                        errors.push(createErrorMessage(node, sourceFile, ERROR_MSG_TWO));
                    }
                }
                if (results.length <= 0 && errors.length <= 0) {
                    errors.push(createErrorMessage(node, sourceFile, ERROR_MSG_ONE));
                }
                return {
                    results: results,
                    errors: errors,
                };
            }
            catch (e) {
                return {
                    results: [],
                    errors: [],
                };
            }
        },
    };
}
exports.default = parseI18nPointT;
