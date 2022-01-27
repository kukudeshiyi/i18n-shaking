import i18n from 'i18n';

function main() {
    const world = 'world';
    return <div>{i18n.t(`hello${world}`)}</div>
}