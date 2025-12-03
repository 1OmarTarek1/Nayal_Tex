import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import glsl from 'vite-plugin-glsl'   // 👈 استيراد البلجن
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Nayal_Tex/',
  plugins: [
    react({
      devTools: true,
    }),
    glsl(),  // 👈 أضف البلجن هنا
  ],
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      'react-dom/client': resolve(__dirname, 'src/shims/react-dom-client.js'),
      'react-router-dom/dist/index.mjs': 'react-router-dom/dist/index.js',
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-ui': [
            'react-icons',
            'react-masonry-css',
            'yet-another-react-lightbox',
            'react-virtuoso'
          ],
          'vendor-state': ['zustand']
        }
      }
    }
  }
})
