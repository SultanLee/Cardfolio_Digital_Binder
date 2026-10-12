import React, { useState } from 'react'
import { Card } from '../../types/card'

interface WishlistTileProps {
  card: Card
  packName: string
  targetQty: number
  onSelect: () => void
  onSetTargetQty: (qty: number) => void
  onRemove: () => void
}

export const WishlistTile: React.FC<WishlistTileProps> = ({
  card,
  packName,
  targetQty,
  onSelect,
  onSetTargetQty,
  onRemove,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [inputValue, setInputValue] = useState(String(targetQty))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue, 10)
    const safe = isNaN(parsed) ? 1 : Math.max(1, Math.min(999, parsed))
    setInputValue(String(safe))
    onSetTargetQty(safe)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      ;(e.target as HTMLInputElement).blur()
    }
  }

  // targetQty가 외부에서 바뀌면 inputValue 동기화
  React.useEffect(() => {
    setInputValue(String(targetQty))
  }, [targetQty])

  return (
    <div className="wishlist-tile">
      {/* 카드 이미지 (클릭 → 확대 모달) */}
      <div
        className="wishlist-tile-image-wrapper"
        onClick={onSelect}
        role="button"
        tabIndex={0}
        aria-label="카드 상세 이미지 보기"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
      >
        {!isLoaded && !hasError && (
          <div className="card-skeleton" aria-hidden="true" />
        )}
        {hasError ? (
          <div className="card-error-placeholder">
            <span>이미지 로드 실패</span>
          </div>
        ) : (
          <img
            src={card.imagePath}
            alt="카드 이미지"
            loading="lazy"
            className={`card-image ${isLoaded ? 'loaded' : ''}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        )}

        {card.rarity && (
          <div
            className={`card-rarity-badge rarity-${card.rarity
              .toLowerCase()
              .replace('+', '-plus')}`}
            title={card.rarityName ? `${card.rarity} (${card.rarityName})` : card.rarity}
          >
            {card.rarity}
          </div>
        )}
      </div>

      {/* 하단 정보 바 */}
      <div className="wishlist-tile-footer">
        <span className="wishlist-pack-label">{packName}</span>
        <div
          className="wishlist-footer-actions"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 목표 수량 */}
          <div className="wishlist-qty-control">
            <span className="wishlist-qty-label">목표</span>
            <button
              className="qty-btn"
              onClick={() => onSetTargetQty(Math.max(1, targetQty - 1))}
              aria-label="목표 수량 감소"
            >
              −
            </button>
            <input
              type="number"
              className="qty-input"
              value={inputValue}
              min={1}
              max={999}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              aria-label="목표 수량"
            />
            <button
              className="qty-btn"
              onClick={() => onSetTargetQty(Math.min(999, targetQty + 1))}
              aria-label="목표 수량 증가"
            >
              +
            </button>
          </div>

          {/* 위시리스트에서 제거 */}
          <button
            className="wishlist-remove-btn"
            onClick={onRemove}
            aria-label="위시 리스트에서 제거"
            title="위시 리스트에서 제거"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
