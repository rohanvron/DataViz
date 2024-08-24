import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      base: '/DataViz/',
      '/api': 'https://data-viz-three.vercel.app'
    }
  }
})
