import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return tag.startsWith("ha-") || tag.startsWith("hui-") || tag.startsWith("mwc-");
          },
        },
      },
    }),
  ],
  build: {
    target: "modules",
    outDir: ".", 
    assetsDir: "",
    rollupOptions: {
      input: "src/main.ts",
      output: {
        entryFileNames: `[name].js`,
      },
    },
    /* minify: 'terser',
    terserOptions: {
      output: {
        comments: false,
      },
      compress: {
        drop_console: true,
      },
      mangle: true, // Modify as needed
    }, */
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});


