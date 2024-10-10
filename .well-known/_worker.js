export default {
    async fetch(request) {
        const url = new URL(request.url);
        if (url.pathname.startsWith('/api/')) {
            const apiUrl = `http://47.98.118.134${url.pathname}`;
            const newRequest = new Request(apiUrl, {
                method: request.method,
                headers: request.headers,
                body: request.body,
            });
            return fetch(newRequest);
        }
        return fetch(request);
    },
};
