import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";
import externalGlobals from "rollup-plugin-external-globals";
import viteComppression from "vite-plugin-compression";
import path from "path";
import terser from "@rollup/plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";
// import { tr } from "element-plus/es/locale";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
      },
    },
  },

  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
  build: {
    rollupOptions: {
      includes: ["@element-plus/icons-vue"],
      external: ["vue", "element-plus", "vue-router"],
      plugins: [
        externalGlobals({
          vue: "Vue",
          "element-plus": "ElementPlus",
          "vue-router": "VueRouter",
        }),
      ],
      output: {
        // chunkFileNames: "js/[name]-[hash].js",
        // entryFileNames: "js/[name]-[hash].js",
        // assetFileNames: "[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // return id.toString().split("node_modules/")[1].split("/")[0].toString();
            return "vendor";
          }
        },
      },
    },
  },
  plugins: [
    vue(),
    visualizer({ open: true }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          vuescript:
            '<script src="https://cdn.jsdelivr.net/npm/vue@3.2.37"></script>',
          elementPlusScript: `
            <link href="https://cdn.jsdelivr.net/npm/element-plus@2.4.1/dist/index.min.css" rel="stylesheet">
            <script src="https://cdn.jsdelivr.net/npm/element-plus@2.4.1/dist/index.full.min.js"></script>
          `,
          vueRouter:
            '<script src="https://unpkg.com/vue-router@4.2.5/dist/vue-router.global.js"></script>',
        },
      },
    }),
  ],
});
