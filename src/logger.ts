import http from 'http';
import { logMessages } from './utils';
import { LOG_TYPE } from './constants';
import artTemplate from 'art-template';
import { join } from 'path';
import chalk from 'chalk';
import { LoggerData } from './types/index';

const PORT = '8888';

async function createLoggerHtml({ sourceFileNames, warnings }: LoggerData) {
  try {
    const html = artTemplate(join(__dirname, '../static/logger.art'), {
      sourceFileNames,
      warnings,
    });
    return html;
  } catch (e) {
    return '';
  }
}

async function createLoggerSever(html: string) {
  return new Promise<void>((resolve, reject) => {
    const server = http.createServer((_req, res) => {
      res.writeHead(200);
      res.end(html);
    });
    server.listen(PORT, () => {
      resolve();
      logMessages(
        [
          `please visit ${chalk.blue(
            `http://localhost:${PORT}`
          )} to view the log`,
        ],
        LOG_TYPE.NORMAL
      );
    });

    server.on('error', () => {
      reject();
    });
  });
}

export async function outputLogger(loggerData: LoggerData) {
  try {
    const html = await createLoggerHtml(loggerData);
    await createLoggerSever(html);
  } catch (e) {
    logMessages(
      [
        '\nSourceFiles:',
        ...loggerData.sourceFileNames.map(
          (sourceFileName, index) => `${index + 1}: ${sourceFileName}`
        ),
      ],
      LOG_TYPE.NORMAL
    );
    logMessages(
      [
        '\nWarnings:',
        ...loggerData.warnings.map(
          (warning, index) => `${index + 1}: ${warning}`
        ),
      ],
      LOG_TYPE.WARNING
    );
  }
}
