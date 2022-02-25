import { i18n as trans, store } from '../../core';
import test from 'path';

function main() {
  return (
    <div>
      {trans.t('hello')}
      {test.t('world')}
    </div>
  );
}
