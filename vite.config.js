import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      // Toda petición que empiece con /api será redirigida al backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,   // cambia el header Origin para que el backend lo acepte
        secure: false,        // permite HTTP sin certificado SSL
      },
    },
  },
})
