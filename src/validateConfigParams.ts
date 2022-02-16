import { ConfigParams } from './types';
import { OBJECT_FLAG } from './constants';
export function validateConfigParams(configParams: ConfigParams | undefined) {
  let validateStatus = true;
  const isObject =
    Object.prototype.toString.apply(configParams) === OBJECT_FLAG;
  if (!isObject) {
    validateStatus = false;
    return validateStatus;
  }
  const { entry, output, translateFileDirectoryPath, translateFileName } =
    configParams!;

  // TODO: 校验参数

  return validateStatus;
}
