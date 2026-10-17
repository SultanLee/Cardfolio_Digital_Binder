export interface Idol {
  id: string
  nameKo: string
  nameJa: string
  aliases: string[]
  series: string
  unit?: string
  isStaff?: boolean
}

export interface IdolGroup {
  id: string
  name: string
  nameKo?: string
  nameJa?: string
  aliases?: string[]
  idolIds: string[]
}
