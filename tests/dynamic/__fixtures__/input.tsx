import i18n from 'i18n';

function main() {
    const worldName = 'world';
    return <div>{i18n.t(`hello${worldName}brandon`)}</div>
}