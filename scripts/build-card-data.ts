import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const imagesDir = path.resolve(projectRoot, 'images')
const outputDir = path.resolve(projectRoot, 'src/data')
const outputFile = path.resolve(outputDir, 'cards.json')

if (!fs.existsSync(imagesDir)) {
  console.error('images 디렉터리를 찾을 수 없습니다.')
  process.exit(1)
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * 브랜드/팩별 레어도 구간 정의
 * 등급 가중치(rank) range는 10 단위(10, 20, 30, ...)로 설정하여 추후 유연하게 대응
 * N: 10, CP: 15, R: 20, SR: 30, SSR: 40, CGR/BCGR/MLR/PSR: 50, MR: 60, MR+: 70, SEC: 80
 */

function getCardRarity(packName: string, filename: string): { rarity: string; rarityName: string; rarityRank: number } {
  // 1. SideM ver. vol.1
  if (packName === 'SideM ver. vol.1') {
    const m = filename.match(/img_sidem_01_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 24) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 48) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 56) return { rarity: 'SR', rarityName: 'スーパーレア', rarityRank: 30 }
      if (num <= 64) return { rarity: 'SSR', rarityName: 'スーパースペシャルレア', rarityRank: 40 }
      if (num <= 72) return { rarity: 'PSR', rarityName: 'Passionレア', rarityRank: 50 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  // 2. SideM ver. vol.2
  if (packName === 'SideM ver. vol.2') {
    const m = filename.match(/img_sidem_02_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 25) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 50) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 58) return { rarity: 'SR', rarityName: 'スーパーレア', rarityRank: 30 }
      if (num <= 66) return { rarity: 'SSR', rarityName: 'スーパースペシャルレア', rarityRank: 40 }
      if (num <= 74) return { rarity: 'PSR', rarityName: 'Passionレア', rarityRank: 50 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  // 3. アイドルマスターver
  if (packName.includes('アイドルマスターver')) {
    const m = filename.match(/img_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 39) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 53) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 92) return { rarity: 'SR', rarityName: 'スーパーレア', rarityRank: 30 }
      if (num <= 106) return { rarity: 'SSR', rarityName: 'スーパースペシャルレア', rarityRank: 40 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  // 4. シャイニーカラーズ
  if (packName === 'シャイニーカラーズver. vol.1') {
    const m = filename.match(/img_sc_01_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 28) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 56) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 84) return { rarity: 'SR', rarityName: 'スーパーレア', rarityRank: 30 }
      if (num <= 112) return { rarity: 'SSR', rarityName: 'スーパースペシャルレア', rarityRank: 40 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  if (packName === 'シャイニーカラーズver. vol.2') {
    const m = filename.match(/img_sc_02_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 28) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 56) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 64) return { rarity: 'SR', rarityName: 'スーパーレア', rarityRank: 30 }
      if (num <= 92) return { rarity: 'SSR', rarityName: 'スーパースペシャルレア', rarityRank: 40 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  if (packName === 'シャイニーカラーズver. vol.3') {
    const m = filename.match(/img_sc_03_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 28) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 56) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 63) return { rarity: 'SR', rarityName: 'スーパーレア', rarityRank: 30 }
      if (num <= 91) return { rarity: 'SSR', rarityName: 'スーパースペシャルレア', rarityRank: 40 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  // 5. シンデレラガールズ (기본 파일 기준)
  if (packName === 'シンデレラガールズver. vol.1') {
    const m = filename.match(/img_cg_01_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 63) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 126) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  if (packName === 'シンデレラガールズver. vol.2') {
    const m = filename.match(/img_cg_02_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 63) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 126) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  if (packName === 'シンデレラガールズver. vol.3') {
    const m = filename.match(/img_cg_03_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 64) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 128) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  if (packName === 'シンデレラガールズver. vol.4') {
    const m = filename.match(/img_cg_04_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 63) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 126) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  if (packName === 'シンデレラガールズver. vol.5') {
    const m = filename.match(/img_cg_05_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 63) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 126) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  if (packName === 'シンデレラガールズver. vol.6') {
    const m = filename.match(/img_cg_06_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 64) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 128) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  // 6. ミリオンライブ！
  // vol.1 (158장: img_ml_0001 ~ img_ml_0158)
  // N: 1~52 (52종)
  // R: 53~104 (52종)
  // SR: 105~156 (52종)
  // MR: 157~158 (2종)
  if (packName === 'ミリオンライブ！ver') {
    const m = filename.match(/img_ml_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 52) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 104) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 156) return { rarity: 'SR', rarityName: 'スーパーレア', rarityRank: 30 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  if (packName === 'ミリオンライブ！ver. vol.2') {
    const m = filename.match(/img_ml_02_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 52) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 78) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 104) return { rarity: 'MLR', rarityName: 'ミリオンライブレア', rarityRank: 50 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  if (packName === 'ミリオンライブ！ver. vol.3') {
    const m = filename.match(/img_ml_03_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 52) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 83) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 114) return { rarity: 'MLR', rarityName: 'ミリオンライブレア', rarityRank: 50 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  if (packName === 'ミリオンライブ！ver. vol.4') {
    const m = filename.match(/img_ml_04_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 52) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 79) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 106) return { rarity: 'MLR', rarityName: 'ミリオンライブレア', rarityRank: 50 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  // 7. 学園アイドルマスター
  if (packName.includes('学園アイドルマスター')) {
    const m = filename.match(/img_gkmas_01_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 26) return { rarity: 'N', rarityName: 'ノーマル', rarityRank: 10 }
      if (num <= 52) return { rarity: 'CP', rarityName: 'キャンペーン', rarityRank: 15 }
      if (num <= 78) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      return { rarity: 'MR', rarityName: 'マスターレア', rarityRank: 60 }
    }
  }

  // 8. プレミアムパック DAY1 (145장)
  // R: 1~59 (59종)
  // SSR: 60~118 (59종)
  // SR: sr_0119~sr_0145 (27종)
  if (packName === 'プレミアムパック DAY1') {
    if (filename.includes('sr_')) {
      return { rarity: 'SR', rarityName: 'スーパーレア', rarityRank: 30 }
    }
    const m = filename.match(/img_wld_01_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 59) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 118) return { rarity: 'SSR', rarityName: 'スーパースペシャルレア', rarityRank: 40 }
    }
  }

  // 9. プレミアムパック DAY2 (145장)
  // R: 1~59 (59종)
  // SSR: 60~118 (59종)
  // SR: sr_0119~sr_0145 (27종)
  if (packName === 'プレミアムパック DAY2') {
    if (filename.includes('sr_')) {
      return { rarity: 'SR', rarityName: 'スーパーレア', rarityRank: 30 }
    }
    const m = filename.match(/img_wld_02_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 59) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 118) return { rarity: 'SSR', rarityName: 'スーパースペシャルレア', rarityRank: 40 }
    }
  }

  // 10. プレミアムパック IWSF (114장)
  // R: 1~43 (43종)
  // SSR: 44~86 (43종)
  // SR: 87~111 (25종)
  // SEC: sec_01~sec_03 (3종)
  if (packName === 'プレミアムパック IWSF') {
    if (filename.includes('sec_')) {
      return { rarity: 'SEC', rarityName: 'シークレット', rarityRank: 80 }
    }
    const m = filename.match(/img_iwsf_01_(\d+)\.webp/)
    if (m) {
      const num = parseInt(m[1], 10)
      if (num <= 43) return { rarity: 'R', rarityName: 'レア', rarityRank: 20 }
      if (num <= 86) return { rarity: 'SSR', rarityName: 'スーパースペシャルレア', rarityRank: 40 }
      if (num <= 111) return { rarity: 'SR', rarityName: 'スーパーレア', rarityRank: 30 }
    }
  }

  return { rarity: 'OTHER', rarityName: 'その他', rarityRank: 0 }
}

const packDirs = fs
  .readdirSync(imagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

const packs = packDirs.map((packName) => {
  const packPath = path.join(imagesDir, packName)
  const hexId = Buffer.from(packName, 'utf8').toString('hex')
  const packId = `pack-${hexId}`

  // 해당 팩 내 파일 읽기
  let files = fs
    .readdirSync(packPath)
    .filter((f) => f.endsWith('.webp'))

  // 신데렐라 걸즈 팩의 경우 단일 예시 bcgr 파일이 있다면 목록에서 제외 (옵션 1에 의해 R 기반으로 전 종 생성)
  if (packName.startsWith('シンデレラガールズver.')) {
    files = files.filter((f) => !f.includes('bcgr'))
  }

  files.sort()

  // 기본 파일 기반 카드 목록 생성
  let cards: any[] = []

  files.forEach((filename) => {
    const cardId = `${packId}:${filename}`
    const imagePath = `/images/${encodeURIComponent(packName)}/${filename}`
    const sourceUrl = `https://cardfolio.idolmaster-official.jp/images/cardlist/${filename}`
    const rarityInfo = getCardRarity(packName, filename)

    cards.push({
      id: cardId,
      filename,
      imagePath,
      sourceUrl,
      sortOrder: cards.length,
      rarity: rarityInfo.rarity,
      rarityName: rarityInfo.rarityName,
      rarityRank: rarityInfo.rarityRank,
    })
  })

  // ==========================================
  // [옵션 1] 신데렐라 걸즈 CGR, BCGR, MR+ 가공 등급 카드 추가
  // CGR/BCGR: R 카드들의 이미지를 공유하는 상위 등급 카드
  // MR+: MR 카드들의 이미지를 공유하는 상위 등급 카드 (vol.5, vol.6)
  // 카드 순서: N -> R -> CGR/BCGR -> MR -> MR+
  // ==========================================
  if (packName.startsWith('シンデレラガールズver.')) {
    const volMatch = packName.match(/vol\.(\d+)/)
    const volNum = volMatch ? parseInt(volMatch[1], 10) : 1

    const nCards = cards.filter((c) => c.rarity === 'N')
    const rCards = cards.filter((c) => c.rarity === 'R')
    const mrCards = cards.filter((c) => c.rarity === 'MR')

    // 1) vol.1~3: CGR 추가 (R과 동일한 일러스트) / vol.4~6: BCGR 추가
    const parallelCards: any[] = []
    if (volNum <= 3) {
      rCards.forEach((rCard) => {
        const cgrId = `${packId}:cgr:${rCard.filename}`
        parallelCards.push({
          id: cgrId,
          filename: `cgr_${rCard.filename}`,
          imagePath: rCard.imagePath,
          sourceUrl: rCard.sourceUrl,
          sortOrder: 0,
          rarity: 'CGR',
          rarityName: 'シンデレラガールズレア',
          rarityRank: 50,
        })
      })
    } else {
      rCards.forEach((rCard) => {
        const bcgrId = `${packId}:bcgr:${rCard.filename}`
        parallelCards.push({
          id: bcgrId,
          filename: `bcgr_${rCard.filename}`,
          imagePath: rCard.imagePath,
          sourceUrl: rCard.sourceUrl,
          sortOrder: 0,
          rarity: 'BCGR',
          rarityName: 'バーニングシンデレラガールズレア',
          rarityRank: 50,
        })
      })
    }

    // 2) vol.5, vol.6: MR+ 추가 (MR과 동일한 일러스트)
    const mrPlusCards: any[] = []
    if (volNum >= 5) {
      mrCards.forEach((mrCard) => {
        const mrPlusId = `${packId}:mrplus:${mrCard.filename}`
        mrPlusCards.push({
          id: mrPlusId,
          filename: `mrplus_${mrCard.filename}`,
          imagePath: mrCard.imagePath,
          sourceUrl: mrCard.sourceUrl,
          sortOrder: 0,
          rarity: 'MR+',
          rarityName: 'マスターレアプラス',
          rarityRank: 70,
        })
      })
    }

    // 기본 번호순: N -> R -> CGR/BCGR -> MR -> MR+
    cards = [...nCards, ...rCards, ...parallelCards, ...mrCards, ...mrPlusCards]
    cards.forEach((c, idx) => {
      c.sortOrder = idx
    })
  }

  // ==========================================
  // [밀리언라이브 vol.1] MLR 가공 등급 카드 추가
  // vol1의 MLR은 SR의 호화 가공 버전 (52종, 일러스트 동일)
  // 카드 순서: N -> R -> SR -> MLR -> MR
  // ==========================================
  if (packName === 'ミリオンライブ！ver') {
    const nonMrCards = cards.filter((c) => c.rarity !== 'MR') // N, R, SR
    const mrCards = cards.filter((c) => c.rarity === 'MR')
    const srCards = cards.filter((c) => c.rarity === 'SR')

    const mlrCards = srCards.map((srCard) => {
      const mlrId = `${packId}:mlr:${srCard.filename}`
      return {
        id: mlrId,
        filename: `mlr_${srCard.filename}`,
        imagePath: srCard.imagePath,
        sourceUrl: srCard.sourceUrl,
        sortOrder: 0,
        rarity: 'MLR',
        rarityName: 'ミリオンライブレア',
        rarityRank: 50,
      }
    })

    // 기본 번호순: N, R, SR -> MLR -> MR
    cards = [...nonMrCards, ...mlrCards, ...mrCards]
    cards.forEach((c, idx) => {
      c.sortOrder = idx
    })
  }

  return {
    id: packId,
    name: packName,
    cards,
  }
})

fs.writeFileSync(outputFile, JSON.stringify({ packs }, null, 2), 'utf8')
const totalCards = packs.reduce((sum, p) => sum + p.cards.length, 0)
console.log(`src/data/cards.json 생성 완료 (${packs.length}개 팩, 총 ${totalCards}장)`)
