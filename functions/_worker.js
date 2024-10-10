export default {
    async fetch(request) {
        const url = new URL(request.url);
        console.log('Request received for:', url.pathname);
        if (url.pathname.startsWith('/api/')) {
            // const apiUrl = `http://47.98.118.134${url.pathname}`;
            // console.log('Proxying request to:', apiUrl);
            // const newRequest = new Request(apiUrl, {
            //     method: request.method,
            //     headers: request.headers,
            //     body: request.body,
            // });
            // return env.ASSETS.fetch(newRequest);
            return new Response('Ok');
        }
        return fetch(request);
    },
};
