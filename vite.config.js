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
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    // Ensure all assets are included in the build
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp', '**/*.ico'],
    rollupOptions: {
      output: {
        // Ensure content files are copied to the output
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.match(/\.(jpg|jpeg|png|svg|gif|webp|ico)$/)) {
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


