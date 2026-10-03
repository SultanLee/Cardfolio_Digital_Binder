import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// 개발 서버에서 /images/... 요청을 로컬 images/ 폴더로 제공하고,
// 프로덕션 빌드 시 images/ → dist/images/ 로 복사하는 플러그인
function cardfolioImages() {
  return {
    name: 'cardfolio-images',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url?.startsWith('/images/')) {
          const filePath = resolve(__dirname, req.url.slice(1))
          if (fs.existsSync(filePath)) {
            const ext = filePath.split('.').pop()?.toLowerCase()
            const contentType = ext === 'png' ? 'image/png' : ext === 'svg' ? 'image/svg+xml' : 'image/webp'
            res.setHeader('Content-Type', contentType)
            fs.createReadStream(filePath).pipe(res)
            return
          }
        }
        next()
      })
    },
    closeBundle() {
      const src = resolve(__dirname, 'images')
      const dest = resolve(__dirname, 'dist/images')
      if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cardfolioImages()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
