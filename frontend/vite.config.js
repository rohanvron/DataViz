import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/DataViz/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://data-viz-three.vercel.app'
    }
  }
})
