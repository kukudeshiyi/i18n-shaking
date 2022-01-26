"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = __importDefault(require("typescript"));
var parseI18nPointT_1 = __importDefault(require("./plugins/parseI18nPointT"));
function main(file, options) {
    // 读取配置文件
    // 读取命令行参数
    // 读取目前的翻译文件
    // 注入插件
    // 创建 typescript program
    // 过滤掉不需要的 sourceFile，例如去掉类型声明文件、以及 node_modules 中的文件
    // 依次遍历 sourceFile 以及其中的每一个节点并调用插件进行转换
    var plugins = [parseI18nPointT_1.default].reduce(function (pluginsArr, pluginFactory) {
        if (typeof pluginFactory === "function") {
            var plugin = pluginFactory();
            if (typeof plugin.isFit === "function" &&
                typeof plugin.parse === "function") {
                pluginsArr.push(plugin);
            }
        }
        return pluginsArr;
    }, []);
    var program = typescript_1.default.createProgram(file, options || {});
    var sourceFiles = program.getSourceFiles().filter(function (sourceFile) {
        // if (sourceFile.isDeclarationFile) {
        //   return;
        // }
        return !sourceFile.isDeclarationFile;
        // return !sourceFile.fileName.includes(".d.ts");
    });
    console.log("sourceFiles", JSON.stringify(sourceFiles.map(function (sourceFile) { return sourceFile.fileName; })));
    var results = [];
    var errors = [];
    var currentSourceFile = null;
    // 优化
    // 因为像 i.t 这种我们不能只根据节点来确认是用于翻译文案的
    // 所以就需要从引入来确认该文件确实用到了 i18n 来翻译文案
    // 这就需要在配置文件中写入 i18n 原模块地址，然后进行匹配确认
    // 所以，当需要遍历一个 sourceFile 的时候，通过先确认是否引入，来确定该插件在该文件中是否有用，从而对所有插件进行过滤
    // 若过滤之后没有符合要求的插件，则无需再去遍历该 sourceFile 中的节点
    sourceFiles.forEach(function (sourceFile) {
        currentSourceFile = sourceFile;
        typescript_1.default.forEachChild(sourceFile, visit);
    });
    function visit(node) {
        plugins.forEach(function (plugin) {
            var isFit = plugin.isFit, parse = plugin.parse;
            if (currentSourceFile && isFit(node, currentSourceFile)) {
                var _a = parse(node, currentSourceFile), singleNodeParseResults = _a.results, singleNodeParseErrors = _a.errors;
                results.push.apply(results, singleNodeParseResults);
                errors.push.apply(errors, singleNodeParseErrors);
            }
        });
        typescript_1.default.forEachChild(node, visit);
    }
    var handleResults = Array.from(new Set(results));
    console.log("handleResults:", JSON.stringify(handleResults));
    // console.log("results:", JSON.stringify(results));
    console.log("errors", errors);
}
main(process.argv.slice(2), {
    jsx: typescript_1.default.JsxEmit.ReactNative,
});
