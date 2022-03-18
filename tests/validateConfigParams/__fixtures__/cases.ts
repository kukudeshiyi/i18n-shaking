import path from 'path';

export const rootPath = __dirname;

export const successCase = {
  entry: ['./src/index.ts', './src/otherEntry.ts'],
  translateFileNames: ['en.json', 'other.json'],
  translateFileDirectoryPath: './assert',
  output: './output',
  importInfos: [
    { name: 'i18n', path: '' },
    { name: 'trans', path: 'i18nt' },
    { name: 't', path: 'i18n' },
  ],
  frame: 'react',
  keyWhiteList: ['123'],
};

export const failedCase1 = {
  entry: ['./src/none.ts'],
  translateFileNames: ['en.json', 'other.json', 'none.json'],
  translateFileDirectoryPath: './assert',
  output: './noneOutput',
  importInfos: [
    { name: 'i18n', path: '' },
    { name: 'trans', path: 'i18nt' },
    { name: '', path: 'i18n' },
    { name: 123, path: 'i18n' },
  ],
  frame: 'react123',
  keyWhiteList: [7],
};

export const failedCase2 = {
  entry: './src/none.ts',
  translateFileNames: ['en.json', 'other.json', 'none.json'],
  translateFileDirectoryPath: 123,
  output: 123,
  importInfos: {},
  frame: 123,
  keyWhiteList: 0,
};
