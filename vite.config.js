import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ensure all assets are included in the build
    assetsInclude: ['**/*.json'],
    rollupOptions: {
      output: {
        // Ensure content files are copied to the output
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.json')) {
            return 'content/[name][extname]';
          }
          if (assetInfo.name?.match(/\.(jpg|jpeg|png|svg|gif|webp)$/)) {
            return 'images/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  // Ensure public directory is properly served
  publicDir: 'public',
  base: './'
})

