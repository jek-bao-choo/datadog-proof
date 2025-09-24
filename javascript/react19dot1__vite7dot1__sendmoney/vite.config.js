import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Enable access from mobile devices on local network
    port: 5173,
    open: true
  },
  esbuild: {
    jsxInject: `import React from 'react'`, // Auto-import React for JSX
  }
})
