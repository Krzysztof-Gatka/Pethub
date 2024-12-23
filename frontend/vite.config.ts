import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Use polling for file changes
    },
    host: true, // Allow connections from outside localhost
    port: 5173,
  },
  define: {
    "process.env": {},
  },
})
