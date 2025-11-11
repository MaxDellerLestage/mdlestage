import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'


// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  plugins: [
    react(),
    glsl({
      include: ['**/*.glsl', '**/*.frag', '**/*.vert'],
    })
  ],
})
