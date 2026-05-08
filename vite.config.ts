import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sonda from 'sonda/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const analyze = mode === 'analyze'

  return {
    plugins: [react(), ...(analyze ? [Sonda()] : [])],
    publicDir: './public',
    build: {
      sourcemap: analyze,
    },
  }
})
