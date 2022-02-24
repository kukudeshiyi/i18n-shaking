import { trans, store } from 'i18nt';
import i18n from 'path';
import t from 'i18n';
import { t as tt } from 'i18n';
function main() {
  const r = trans.t('name_key');
  const r2 = store.t('error_key');
  const r3 = trans('age_key');
  const r4 = store('error_key');
  const r5 = t('use_t');
  const r6 = tt('use_tt');
  return (
    <View>
      <div>{i18n.t('hello')}</div>
      <Text>{i18n('hello')}</Text>
    </View>
  );
}
