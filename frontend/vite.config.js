import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
  },
  optimizeDeps: {
    // Disable auto-discovery; list all deps explicitly.
    // This stops Vite from doing mid-session re-optimization (which causes the
    // Windows EPERM rename error on node_modules/.vite/deps_temp_xxx → deps).
    noDiscovery: true,
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-dev-runtime',
      'react-router-dom',
      'lucide-react',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/analytics',
    ],
  },
})
