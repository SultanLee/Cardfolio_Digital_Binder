import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const imagesDir = path.resolve(projectRoot, 'images')
const outputDir = path.resolve(projectRoot, 'src/data')
const outputFile = path.resolve(outputDir, 'cards.json')

// cards.json이 이미 존재하고 비어있지 않다면 기존 파일 유지
if (fs.existsSync(outputFile) && fs.statSync(outputFile).size > 1000) {
  console.log('src/data/cards.json 이 이미 존재하므로 기존 데이터를 유지합니다.')
  process.exit(0)
}

if (!fs.existsSync(imagesDir)) {
  console.error('images 디렉터리를 찾을 수 없습니다.')
  process.exit(1)
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const packDirs = fs
  .readdirSync(imagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

const packs = packDirs.map((packName) => {
  const packPath = path.join(imagesDir, packName)
  const hexId = Buffer.from(packName, 'utf8').toString('hex')
  const packId = `pack-${hexId}`

  const files = fs
    .readdirSync(packPath)
    .filter((f) => f.endsWith('.webp'))
    .sort()

  const cards = files.map((filename, index) => {
    const cardId = `${packId}:${filename}`
    const imagePath = `/images/${encodeURIComponent(packName)}/${filename}`
    const sourceUrl = `https://cardfolio.idolmaster-official.jp/images/cardlist/${filename}`

    return {
      id: cardId,
      filename,
      imagePath,
      sourceUrl,
      sortOrder: index,
    }
  })

  return {
    id: packId,
    name: packName,
    cards,
  }
})

fs.writeFileSync(outputFile, JSON.stringify({ packs }, null, 2), 'utf8')
console.log(`src/data/cards.json 생성 완료 (${packs.length}개 팩)`)
