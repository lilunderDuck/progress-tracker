import { defineConfig, ESBuildOptions } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import devtools from 'solid-devtools/vite'
import molcssPlugin from "molcss/vite-plugin"

export default defineConfig(({ command }) => {
  const isDevMode = command !== "build"

  const esbuildOptions = isDevMode ? {} : {
    drop: ['console', 'debugger']
  } as ESBuildOptions

  return {
    plugins: [
      devtools(), 
      solidPlugin(), 
      molcssPlugin({
        content: 'frontend/**/*.{js,jsx,ts,tsx}',
      })
    ],
    server: {
      port: 3000,
    },
    build: {
      target: 'esnext',
      outDir: "./build/dist"
    },
    esbuild: {
      ...esbuildOptions,
      define: {
        APP_VERSION: `"v1.5 ${isDevMode ? "debug" : "release"} - ${new Date().toLocaleDateString('en-GB')}"`
      }
    },
    publicDir: "./public",
  }
});
