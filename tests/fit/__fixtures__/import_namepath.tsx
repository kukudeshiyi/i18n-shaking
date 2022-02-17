import { trans, store } from 'i18nt';
import i18n from 'path';

function main() {
  const r = trans.t('name_key');
  const r2 = store.t('error_key');
  const r3 = trans.t('age_key');
  return <div>{i18n.t('hello')}</div>;
}
