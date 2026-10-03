import React from 'react'
import { Card } from '../../types/card'

interface RaritySummaryProps {
  cards: Card[]
  selectedRarity: string | null
  onSelectRarity: (rarity: string | null) => void
}

interface RarityGroup {
  rarity: string
  rarityName: string
  count: number
  rank: number
}

export const RaritySummary: React.FC<RaritySummaryProps> = ({
  cards,
  selectedRarity,
  onSelectRarity,
}) => {
  // 카드 목록으로부터 레어도별 종류 수 집계
  const rarityGroups = React.useMemo(() => {
    const map = new Map<string, RarityGroup>()

    for (const card of cards) {
      const r = card.rarity || 'OTHER'
      const name = card.rarityName || ''
      const rank = card.rarityRank ?? 0

      if (!map.has(r)) {
        map.set(r, {
          rarity: r,
          rarityName: name,
          count: 0,
          rank,
        })
      }
      map.get(r)!.count += 1
    }

    // 가중치(rank) 낮은 순으로 정렬 (공식 사이트의 N -> R -> SR -> SSR -> MR 순서)
    return Array.from(map.values()).sort((a, b) => a.rank - b.rank)
  }, [cards])

  if (rarityGroups.length <= 1) {
    return null
  }

  return (
    <div className="rarity-summary-container">
      <div className="rarity-summary-header">
        <span className="rarity-summary-title">레어도 구성</span>
        {selectedRarity && (
          <button
            className="rarity-summary-reset-btn"
            onClick={() => onSelectRarity(null)}
          >
            전체 보기
          </button>
        )}
      </div>

      <div className="rarity-badge-list">
        {rarityGroups.map((g) => {
          const isSelected = selectedRarity === g.rarity
          return (
            <button
              key={g.rarity}
              className={`rarity-badge-item ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectRarity(isSelected ? null : g.rarity)}
              title={`${g.rarityName ? `${g.rarity} (${g.rarityName})` : g.rarity} 클릭하여 필터링`}
            >
              <span
                className={`rarity-tag rarity-${g.rarity
                  .toLowerCase()
                  .replace('+', '-plus')}`}
              >
                {g.rarity}
              </span>
              <span className="rarity-count">{g.count}종</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
