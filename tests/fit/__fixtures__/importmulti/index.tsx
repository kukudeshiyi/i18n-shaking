import * as trans from 'i18nDir';
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
