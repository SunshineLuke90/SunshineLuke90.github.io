import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // 'main' and 'nested' are arbitrary names for your entry points
        // 'index.html' is still included here for demonstration, you can replace it
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'), // Your custom HTML entry
        contact: resolve(__dirname, 'contact.html'), // Another custom HTML entry
        project1: resolve(__dirname, 'controllingCalcite.html')
      }
    }
  }
})
