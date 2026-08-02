import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 输出目录用 Vite 默认的 dist/，与 Cloudflare Pages 控制台里的「构建输出目录」保持一致
export default defineConfig({
  plugins: [react()],
});
