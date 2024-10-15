import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit(), enhancedImages()],
    server: {
        proxy: {
            "/api": {
                // target: 'http://47.98.118.134',
                target: "http://127.0.0.1:5000",
                changeOrigin: true,
                secure: false,
            },
            "/static": {
                target: "http://127.0.0.1:5000",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
