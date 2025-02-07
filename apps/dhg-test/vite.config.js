import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Most basic possible config
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': new URL('./src', import.meta.url).pathname
        }
    }
});
