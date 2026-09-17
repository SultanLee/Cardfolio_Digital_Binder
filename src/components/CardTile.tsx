import React, { useState } from 'react'
import { Card } from '../types/card'

interface CardTileProps {
  card: Card
  onSelect?: (card: Card) => void
}

export const CardTile: React.FC<CardTileProps> = ({ card, onSelect }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div
      className="card-tile"
      onClick={() => onSelect?.(card)}
    >
      <div className="card-image-wrapper">
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
      </div>
    </div>
  )
}
