// vite.config.js
import { defineConfig } from "file:///D:/RMK%20Internship%20App/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/RMK%20Internship%20App/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false
  },
  optimizeDeps: {
    // Disable auto-discovery; list all deps explicitly.
    // This stops Vite from doing mid-session re-optimization (which causes the
    // Windows EPERM rename error on node_modules/.vite/deps_temp_xxx → deps).
    noDiscovery: true,
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-dev-runtime",
      "react-router-dom",
      "lucide-react",
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "firebase/analytics"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxSTUsgSW50ZXJuc2hpcCBBcHBcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFJNSyBJbnRlcm5zaGlwIEFwcFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovUk1LJTIwSW50ZXJuc2hpcCUyMEFwcC9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgc3RyaWN0UG9ydDogZmFsc2UsXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIC8vIERpc2FibGUgYXV0by1kaXNjb3Zlcnk7IGxpc3QgYWxsIGRlcHMgZXhwbGljaXRseS5cbiAgICAvLyBUaGlzIHN0b3BzIFZpdGUgZnJvbSBkb2luZyBtaWQtc2Vzc2lvbiByZS1vcHRpbWl6YXRpb24gKHdoaWNoIGNhdXNlcyB0aGVcbiAgICAvLyBXaW5kb3dzIEVQRVJNIHJlbmFtZSBlcnJvciBvbiBub2RlX21vZHVsZXMvLnZpdGUvZGVwc190ZW1wX3h4eCBcdTIxOTIgZGVwcykuXG4gICAgbm9EaXNjb3Zlcnk6IHRydWUsXG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3JlYWN0JyxcbiAgICAgICdyZWFjdC1kb20nLFxuICAgICAgJ3JlYWN0LWRvbS9jbGllbnQnLFxuICAgICAgJ3JlYWN0L2pzeC1kZXYtcnVudGltZScsXG4gICAgICAncmVhY3Qtcm91dGVyLWRvbScsXG4gICAgICAnbHVjaWRlLXJlYWN0JyxcbiAgICAgICdmaXJlYmFzZS9hcHAnLFxuICAgICAgJ2ZpcmViYXNlL2F1dGgnLFxuICAgICAgJ2ZpcmViYXNlL2ZpcmVzdG9yZScsXG4gICAgICAnZmlyZWJhc2UvYW5hbHl0aWNzJyxcbiAgICBdLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1IsU0FBUyxvQkFBb0I7QUFDblQsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsY0FBYztBQUFBO0FBQUE7QUFBQTtBQUFBLElBSVosYUFBYTtBQUFBLElBQ2IsU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
