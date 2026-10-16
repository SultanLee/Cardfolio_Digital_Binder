import React from 'react'

export type FilterMode = 'all' | 'owned' | 'unowned'

interface CollectionFilterProps {
  currentFilter: FilterMode
  onFilterChange: (filter: FilterMode) => void
  totalCount: number
  ownedCount: number
  unownedCount: number
}

export const CollectionFilter: React.FC<CollectionFilterProps> = ({
  currentFilter,
  onFilterChange,
  totalCount,
  ownedCount,
  unownedCount,
}) => {
  return (
    <div className="collection-filter-group" role="tablist" aria-label="카드 보유 필터">
      <button
        type="button"
        role="tab"
        aria-selected={currentFilter === 'all'}
        className={`filter-tab-btn ${currentFilter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        전체
        <span className="filter-count-badge">{totalCount}</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={currentFilter === 'owned'}
        className={`filter-tab-btn ${currentFilter === 'owned' ? 'active' : ''}`}
        onClick={() => onFilterChange('owned')}
      >
        보유
        <span className="filter-count-badge">{ownedCount}</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={currentFilter === 'unowned'}
        className={`filter-tab-btn ${currentFilter === 'unowned' ? 'active' : ''}`}
        onClick={() => onFilterChange('unowned')}
      >
        미보유
        <span className="filter-count-badge">{unownedCount}</span>
      </button>
    </div>
  )
}
