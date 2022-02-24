import i18n from 'i18n';

function main() {
  const { t } = i18n;
  return <Text>{t('hello' + 'world')}</Text>;
}
