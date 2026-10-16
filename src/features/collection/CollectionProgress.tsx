import React from 'react'

interface CollectionProgressProps {
  totalCount: number
  ownedUniqueCount: number
  totalOwnedCount: number
  label?: string
}

export const CollectionProgress: React.FC<CollectionProgressProps> = ({
  totalCount,
  ownedUniqueCount,
  totalOwnedCount,
  label = '수집 진척도',
}) => {
  const percentage =
    totalCount > 0 ? Math.round((ownedUniqueCount / totalCount) * 1000) / 10 : 0

  return (
    <div className="collection-progress-container">
      <div className="progress-stats">
        <div className="progress-labels">
          <span className="progress-title">{label}</span>
          <span className="progress-counts">
            <strong>{ownedUniqueCount}</strong> / {totalCount}종
            <span className="progress-percent"> ({percentage}%)</span>
          </span>
        </div>
        {totalOwnedCount > 0 && (
          <span className="progress-total-owned" title="중복 포함 총 보유 카드 수">
            총 {totalOwnedCount}장 소장 중
          </span>
        )}
      </div>

      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  )
}
