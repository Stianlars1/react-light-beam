import { defineConfig } from "tsup";

export default defineConfig({
  // Entry point
  entry: ["src/index.tsx"],

  // Output both ESM and CommonJS
  format: ["esm", "cjs"],

  // Generate TypeScript declarations
  dts: {
    resolve: true,
  },

  // Source maps for debugging
  sourcemap: true,

  // Clean dist before build
  clean: true,

  // Don't bundle peer dependencies
  external: ["react", "react-dom", "framer-motion"],

  // Tree shaking
  treeshake: true,

  // Target environment
  target: "es2020",

  // Minification - false for readable output
  minify: false,

  // Code splitting - false for libraries
  splitting: false,

  // Copy CSS files and add "use client" directive after build
  onSuccess: "shx mkdir -p dist/css && shx cp src/css/lightBeam.css dist/css/ && node scripts/add-use-client.js",
});
