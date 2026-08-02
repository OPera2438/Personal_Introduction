import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 输出目录用 Vite 默认的 dist/，与 Cloudflare Pages 控制台里的「构建输出目录」保持一致
export default defineConfig({
  plugins: [react()],
  build: {
    // 覆盖仍在使用的常见浏览器，同时避免为了过旧浏览器引入大体积 polyfill。
    target: ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14'],
  },
});
