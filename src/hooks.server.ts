import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { toast } from "svelte-sonner";

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("token");
    const publicRoutes = ["/login", "/register", "/"];
    const isPublicRoute = publicRoutes.includes(event.url.pathname);
    console.log(123);
    if (!token && !isPublicRoute) {
        toast.error("You must be logged in to access this page");
        throw redirect(302, "/login");
    }

    return resolve(event);
};
