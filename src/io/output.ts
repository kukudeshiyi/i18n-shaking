import { TranslateKeyFileData, ConfigParams } from '../types/index';
// 输出过滤文件
// 输出提示信息
export function output(
  translateKeys: Array<TranslateKeyFileData>,
  configParams: ConfigParams
) {
  // 根据 output 路径输出
  // TODO: 后续优化，如果 output 未配置则采用覆盖读取文件的方式进行输出
}
