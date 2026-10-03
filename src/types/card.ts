export interface Card {
  id: string
  filename: string
  imagePath: string
  sourceUrl: string
  sortOrder: number
  rarity?: string      // 'N', 'R', 'SR', 'SSR', 'MR', 'MLR', 'PSR', 'CP' 등
  rarityRank?: number  // 등급 가중치 (10, 20, 30, ...)
  rarityName?: string  // 'ノーマル', 'レア', 'スーパーレア' 등
}

export interface Pack {
  id: string
  name: string
  cards: Card[]
}

export interface CardsData {
  packs: Pack[]
}
