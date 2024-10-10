import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit(), enhancedImages()],
    server: {
        proxy: {
            '/api': {
                target: 'http://47.98.118.134',
                changeOrigin: true,
            },
            '/uploads': {
                target: 'http://47.98.118.134',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
