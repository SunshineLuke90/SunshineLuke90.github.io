import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir:'./public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        blog: resolve(__dirname, 'blog.html'),
        controllingCalcite: resolve(__dirname, 'controllingCalcite.html'),
        onHover: resolve(__dirname, 'onHover.html'),
        accessibility: resolve(__dirname, 'accessibility.html'),
        radar: resolve(__dirname, 'radar.html'),
        exb: resolve(__dirname, 'exb.html')
      }
    }
  }
})
