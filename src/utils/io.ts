import chalk from 'chalk';
import { LOG_TYPE } from '../constants';
export const logMessages = (messages: string[], logType: LOG_TYPE) => {
  const handleMessages = messages.join('\n');
  chalk[logType](handleMessages);
};
