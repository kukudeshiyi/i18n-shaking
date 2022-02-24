import { trans, store } from 'i18nt';
import i18n from 'path';
import { t as tt } from 'i18n-t';
function main() {
  const r = trans.t('name_key');
  const r2 = store.t('error_key');
  return (
    <View>
      <Text>{trans('age_key')}</Text>
      <Text>{store('error_key')}</Text>
      <Text>{tt('use_tt')}</Text>
      <div>{i18n.t('hello')}</div>
      <Text>{i18n('hello')}</Text>
    </View>
  );
}
