import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
  build: {
    outDir: 'dist',
    assetsDir: 'static', // 將靜態資源放入 static 資料夾
    emptyOutDir: true,
  },
})
