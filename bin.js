#!/usr/bin/env node

const sade = require('sade');
const { i18nShaking } = require('./lib/index.js');
const pkg = require('./package.json');

sade('i18n-shaking', true)
  .version(pkg.version)
  .describe('Size shaking for your i18n \r\n')
  .example('')
  .action(() => {
    i18nShaking();
  })
  .parse(process.argv, {});
