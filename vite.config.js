import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // 输出到 build/ 而不是 Vite 默认的 dist/：
    // Cloudflare Pages 的 React 预设默认就读 build 目录，保持一致，控制台不用改配置
    outDir: 'build',
  },
});
