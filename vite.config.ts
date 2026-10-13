import { copyFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import Sonda from 'sonda/vite'

// GitHub Pages serves 404.html for unknown paths; reuse the SPA shell so client routes work on refresh.
const spaFallback = (): Plugin => {
  let outDir = 'dist'
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved (config) {
      outDir = config.build.outDir
    },
    closeBundle () {
      copyFileSync(`${outDir}/index.html`, `${outDir}/404.html`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const analyze = mode === 'analyze'

  return {
    plugins: [react(), spaFallback(), ...(analyze ? [Sonda()] : [])],
    publicDir: './public',
    build: {
      sourcemap: analyze,
    },
  }
})
