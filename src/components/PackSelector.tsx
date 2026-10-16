import React, { useMemo } from 'react'
import { Pack } from '../types/card'
import { groupPacksByCategory } from '../utils/packCategories'

interface PackSelectorProps {
  packs: Pack[]
  selectedScope: string
  onSelectScope: (value: string) => void
}

export const PackSelector: React.FC<PackSelectorProps> = ({
  packs,
  selectedScope,
  onSelectScope,
}) => {
  const categoryGroups = useMemo(() => groupPacksByCategory(packs), [packs])

  return (
    <div className="pack-selector-container">
      <label htmlFor="card-scope-select" className="pack-select-label">
        카드 범위
      </label>
      <div className="select-wrapper">
        <select
          id="card-scope-select"
          className="pack-select"
          value={selectedScope}
          onChange={(e) => onSelectScope(e.target.value)}
        >
          <option value="all">전체 카드 ({packs.reduce((sum, pack) => sum + pack.cards.length, 0).toLocaleString('ko-KR')}장)</option>
          {categoryGroups.map((group) => (
            <optgroup key={group.id} label={group.categoryName}>
              <option value={`category:${group.id}`}>
                {group.categoryName} 전체 ({group.packs.reduce((sum, pack) => sum + pack.cards.length, 0).toLocaleString('ko-KR')}장)
              </option>
              {group.packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name} ({pack.cards.length}장)
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  )
}
