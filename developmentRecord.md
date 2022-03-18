## 模块拆分

### 读取分析参数

#### 参数类型

1. entry
2. 读取翻译文件路径（包含文件名数组以及文件夹路径）
3. 写入翻译文件路径
4. 额外的不需要过滤的翻译 key

#### 参数解析

1. 因为参数较多，先以配置文件为主，后续增加 cli 参数
2. 首先解析参数校验参数，随后分发参数

### 文件节点遍历模块

1. 针对一个模块文件进行遍历
2. 第一次遍历只遍历该模块文件的子节点，调用插件的 isFit 函数判定插件是否适用于解析当前模块文件
3. 第二次遍历则遍历所有节点，使用过滤的插件对节点进行解析获取使用的翻译 key

### 文件读写模块

1. 当获取到所有的翻译 key
2. 则读取配置中的所有翻译文件
3. 校验后按照现有获取到的 key 进行过滤
4. 过滤之后按照写入翻译文件路径写入过滤后的翻译 key

### 插件模块

### 待办事项

1.  优化参数设计 @liqi.shi done
2.  增加对 node_modules 中 sourceFile 的过滤 @liqi.shi done
3.  处理 shaking 模块的关于 json 格式的校验以及 warnings 的信息处理 @liqi.shi done
4.  拆分 validateConfigParams 模块，细化校验，增加对于 frame 的校验，补充测试用例 @liqi.shi
5.  补充 readme @liqi.shi
6.  解决 plugin 类型问题 @yulong.xiang
7.  整理 各个项目 cases，检查是否有遗漏 @liqi.shi @yulong.xiang
8.  优化 output，不填默认覆盖源文件夹 @liqi.shi
9.  优化 cli 对 pipeline 的支持 @liqi.shi done
10. 支持翻译 key 白名单 @liqi.shi
