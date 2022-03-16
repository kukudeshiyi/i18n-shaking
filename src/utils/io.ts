import chalk from 'chalk';
import { LOG_TYPE } from '../constants';

const getLogMessagesSuffix = (logType: LOG_TYPE) => {
  switch (logType) {
    case LOG_TYPE.ERROR:
      return '[I18n-shaking error]:';
    case LOG_TYPE.WARNING:
      return '[I18n-shaking warning]:';
    case LOG_TYPE.NORMAL:
    case LOG_TYPE.SUCCESS:
    default:
      return '[I18n-shaking info]:';
  }
};

export const logMessages = (messages: string[], logType: LOG_TYPE) => {
  messages.forEach((message) => {
    const handleMessage = getLogMessagesSuffix(logType) + message + '\n';
    console.log(chalk[logType](handleMessage));
  });
};
