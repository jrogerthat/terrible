import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any call to /todos from the browser goes to the .NET API
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