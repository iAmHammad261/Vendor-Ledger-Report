import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path/win32'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: false,       // Bundle ALL css into one file
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        assetFileNames: 'assets/[name][extname]',   // Keeps CSS named predictably
        entryFileNames: 'assets/[name].js',          // Keeps JS named predictably
      }
    }
  }
  
})
