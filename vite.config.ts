import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  build: {
    // 🚀 PERFORMANCE: Optimize CSS and JS splitting
    cssCodeSplit: true, // Split CSS into separate files to parallel load
    cssMinify: true, // Minify CSS (Vite does this by default)
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - optimized for parallel loading
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-popover',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
          ],
          'vendor-form': ['@hookform/resolvers', 'react-hook-form', 'zod'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-utils': ['clsx', 'date-fns', 'tailwind-merge'],
        },
      },
    },
    // 🚀 PERFORMANCE: Inline small assets to reduce HTTP requests
    assetsInlineLimit: 8192, // Inline assets < 8KB (default 4KB)
    chunkSizeWarningLimit: 500,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
