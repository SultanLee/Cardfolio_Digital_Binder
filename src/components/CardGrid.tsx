import React from 'react'
import { Card } from '../types/card'
import { CardTile } from './CardTile'

interface CardGridProps {
  cards: Card[]
  onSelectCard?: (card: Card) => void
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, onSelectCard }) => {
  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <p>표시할 카드가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="card-grid">
      {cards.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          onSelect={onSelectCard}
        />
      ))}
    </div>
  )
}
