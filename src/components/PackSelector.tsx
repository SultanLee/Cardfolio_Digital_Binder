import React, { useMemo } from 'react'
import { Pack } from '../types/card'
import { groupPacksByCategory } from '../utils/packCategories'

interface PackSelectorProps {
  packs: Pack[]
  selectedPackId: string
  onSelectPack: (packId: string) => void
}

export const PackSelector: React.FC<PackSelectorProps> = ({
  packs,
  selectedPackId,
  onSelectPack,
}) => {
  const categoryGroups = useMemo(() => groupPacksByCategory(packs), [packs])

  return (
    <div className="pack-selector-container">
      <label htmlFor="pack-select" className="pack-select-label">
        부스터팩 선택
      </label>
      <div className="select-wrapper">
        <select
          id="pack-select"
          className="pack-select"
          value={selectedPackId}
          onChange={(e) => onSelectPack(e.target.value)}
        >
          {categoryGroups.map((group) => (
            <optgroup key={group.id} label={group.categoryName}>
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
