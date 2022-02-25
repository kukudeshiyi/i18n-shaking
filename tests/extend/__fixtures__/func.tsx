import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';

export default withRouter(() => {
  const { t } = useTranslation();
  return (
    <View>
      <Text>{t('hello')}</Text>
    </View>
  );
});
