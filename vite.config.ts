import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // API is intentionally accessed through Vite so the browser sees one origin.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // MinIO objects arrive from the API as http://localhost:9000/stylometry/...
      // The UI converts them to /s3/stylometry/... before rendering.
      '/s3': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3/, ''),
      },
    },
  },
})
