import i18n from 'i18n';
import { worldName, lastName } from './source';

function main() {
  return <div>{i18n.t(`hello${worldName}brandon${lastName}`)}</div>;
}
