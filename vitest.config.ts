import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    plugins: [
        react(),
        glsl({ include: /\.(glsl|vert|frag|vs|fs)$/ }),
    ],
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.tsx'],
        globals: true,
    },
})