export interface Card {
  id: string
  filename: string
  imagePath: string
  sourceUrl: string
  sortOrder: number
}

export interface Pack {
  id: string
  name: string
  cards: Card[]
}

export interface CardsData {
  packs: Pack[]
}
