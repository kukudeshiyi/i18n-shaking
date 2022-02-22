import test from 'path';
import * as trans from 'i18n';
import tt from 'typescript';

function main() {
  const res = tt('cc');
  const res2 = trans.t('world');
  return <div>{trans.t('hello')}</div>;
}
