#!/usr/bin/env node

const sade = require('sade');
const { i18nShaking } = require('./lib/index.js');
const pkg = require('./package.json');

sade('i18n-shaking [entry]', true)
  .version(pkg.version)
  .describe('Size shaking for your i18n \r\n')
  .example('src/index.ts')
  .action((entry) => {
    i18nShaking([entry]);
  })
  .parse(process.argv, {});
