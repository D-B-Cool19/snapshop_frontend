export function onRequest(context) {
    const prefix = '/foo/';
    const path = context.functionPath;
    if (path.startsWith(prefix)) {
        return fetch(`https://47.98.118.134${path}`);
    }
}
