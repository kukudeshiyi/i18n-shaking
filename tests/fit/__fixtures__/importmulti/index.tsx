import test from 'path';
import i18n from 'i18ntt';
import * as trans from 'i18n';
import tt from 'typescript';
import Child from './child';
import React from 'react';
function main() {
  return (
    <div>
      {trans.t('hello')}
      <Child></Child>
    </div>
  );
}