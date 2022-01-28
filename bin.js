#!/usr/bin/env node

const sade = require('sade');
const { i18nShaking } = require('./dist/index.js');
const pkg = require('./package.json');

sade('i18n-shaking [entry]', true)
  .version(pkg.version)
  .describe('Size shaking for your i18n \r\n')
  .example('src/index.ts')
  .action((entry, opts) => {
    console.log(entry, opts);

    console.log(i18nShaking);

    const { handleResults, errors } = i18nShaking([entry]);

    console.log('Results:' + '\r\n');
    handleResults.forEach((r) => {
      console.log(r) + '\r\n';
    });
    console.log('Error:' + '\r\n');
    errors.forEach((r) => {
      console.log(r) + '\r\n';
    });
  })
  .parse(process.argv, {});
