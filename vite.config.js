import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/leave': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/comment': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/ai': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    }
  }
})
