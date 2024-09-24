import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
    host: '0.0.0.0',
    open: true,
    proxy: { // 代理配置
      '/geo': {
        target: 'https://geo.datav.aliyun.com',
        changeOrigin: true,
        rewrite(path) {
          return path.replace("/geo", "");
      },
      }
    },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
