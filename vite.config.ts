import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-sanity': ['@sanity/client', '@sanity/image-url', '@portabletext/react'],
          'vendor-query': ['@tanstack/react-query'],
        }
      }
    }
  }
})
