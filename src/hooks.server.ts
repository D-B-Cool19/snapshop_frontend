import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("token");
    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.includes(event.url.pathname);

    if (!token && !isPublicRoute) {
        throw redirect(302, "/login");
    }

    return resolve(event);
};
