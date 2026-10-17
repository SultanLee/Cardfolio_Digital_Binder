import React, { useState } from 'react'
import { Card } from '../types/card'
import { QuantityControl } from './QuantityControl'
import { useWishlistStore } from '../stores/useWishlistStore'

interface CardTileProps {
  card: Card
  quantity: number
  onSelect?: (card: Card) => void
  onIncrement: () => void
  onDecrement: () => void
  onSetQuantity: (qty: number) => void
  selectionMode?: boolean
  isSelected?: boolean
  onToggleSelection?: (card: Card) => void
}

export const CardTile: React.FC<CardTileProps> = ({
  card,
  quantity,
  onSelect,
  onIncrement,
  onDecrement,
  onSetQuantity,
  selectionMode = false,
  isSelected = false,
  onToggleSelection,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const isWished = useWishlistStore((state) => state.isWished(card.id))
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)

  const isOwned = quantity > 0
  const activate = () => selectionMode ? onToggleSelection?.(card) : onSelect?.(card)

  return (
    <div
      className={`card-tile ${isOwned ? 'is-owned' : 'is-unowned'}${selectionMode ? ' is-selectable' : ''}${isSelected ? ' is-selected' : ''}`}
    >
      <div
        className="card-image-wrapper"
        onClick={activate}
        role={selectionMode ? 'checkbox' : 'button'}
        aria-checked={selectionMode ? isSelected : undefined}
        tabIndex={0}
        aria-label={selectionMode ? `${card.rarity ?? ''} 카드 ${card.sortOrder + 1} 선택` : '카드 상세 이미지 보기'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            activate()
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

        {isOwned && (
          <div className="card-qty-badge" title={`보유 수량: ${quantity}`}>
            ×{quantity}
          </div>
        )}

        {selectionMode && <span className="card-selection-check" aria-hidden="true">{isSelected ? '✓' : ''}</span>}

        {/* 위시리스트 ♡ 버튼 */}
        {!selectionMode && (
          <button
            className={`card-wish-btn ${isWished ? 'is-wished' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              toggleWishlist(card.id)
            }}
            aria-label={isWished ? '위시 리스트에서 제거' : '위시 리스트에 추가'}
            title={isWished ? '위시 리스트에서 제거' : '위시 리스트에 추가'}
          >
            {isWished ? '♥' : '♡'}
          </button>
        )}
      </div>

      {!selectionMode && (
        <div className="card-action-bar">
          <QuantityControl
            quantity={quantity}
            onChange={onSetQuantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        </div>
      )}
    </div>
  )
}
