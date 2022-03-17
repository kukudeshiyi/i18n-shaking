#!/usr/bin/env node

const sade = require('sade');
const { i18nShaking } = require('./lib/index.js');
const pkg = require('./package.json');

sade('i18n-shaking', true)
  .version(pkg.version)
  .describe('Size shaking for your i18n \r\n')
  .example('')
  .example('--log')
  .option('-l,log', 'generate logs for this shaking for easy inspection')
  .action((src) => {
    i18nShaking({
      log: !!src.log,
    });
  })
  .parse(process.argv, {});
