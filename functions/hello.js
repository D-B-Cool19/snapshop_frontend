export async function onRequest({ request }) {
    // const url = new URL(request.url);
    // const backendUrl = `https://example.com${url.pathname}`; // 替换为你的后端 API 地址
    //
    // // 将请求转发到后端服务
    // const response = await fetch(backendUrl, {
    //     method: request.method,
    //     headers: request.headers,
    //     body: request.body,
    // });

    return new Response('hello');

    // 返回从后端获得的响应
    // return new Response(response.body, {
    //     headers: response.headers,
    //     status: response.status,
    // });
}
