import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 判斷當前環境
  const isProd = mode === 'production';
  
  return {
    plugins: [react()],
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
    // 根據環境設置不同的 base
    base: isProd ? '/taskmind/' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'static', // 將靜態資源放入 static 資料夾
      emptyOutDir: true,
    },
  }
})
