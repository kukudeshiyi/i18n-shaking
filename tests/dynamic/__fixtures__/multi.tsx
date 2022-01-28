import i18n from 'i18n';

function main() {
    const worldName = 'world';
    const lastName = 'x';
    return <div>{i18n.t(`hello${worldName}brandon${lastName}~`)}</div>
}