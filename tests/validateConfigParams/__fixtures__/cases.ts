import path from 'path';

export const rootPath = __dirname;

export const successCase = {
  entry: './src/index.ts',
  translateFileNames: ['en.json', 'other.json'],
  translateFileDirectoryPath: './assert',
  output: './output',
  importInfos: [
    { name: 'i18n', path: '' },
    { name: 'trans', path: 'i18nt' },
    { name: 't', path: 'i18n' },
  ],
};

// 只要保证 rootPath
export const failedCase = {
  entry: './src/index.ts',
  translateFileNames: ['en.json', 'other.json'],
  translateFileDirectoryPath: './assert',
  output: './output',
  importInfos: [
    { name: 'i18n', path: '' },
    { name: 'trans', path: 'i18nt' },
    { name: '', path: 'i18n' },
    { name: 't', path: 'i18n' },
  ],
};
