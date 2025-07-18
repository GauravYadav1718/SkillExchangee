import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // frontend port
    proxy: {
      '/api': {
        target: 'http://localhost:3285', // ✅ backend port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
