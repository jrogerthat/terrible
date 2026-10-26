import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 Vite plugin
  ],
  server: {
    proxy: {
      '/todos': {
        target: 'http://localhost:5193',
        changeOrigin: true,
      },
      '/projects': {
        target: 'http://localhost:5193',
        changeOrigin: true,
      },
    },
  },
})