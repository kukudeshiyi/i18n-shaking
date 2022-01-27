import i18n from 'i18n';

function main() {
    const isShow = true;
    return <div>{i18n.t(isShow ? 'hello': 'world')}</div>
}