import React from 'react'
import { Card } from '../types/card'
import { CardTile } from './CardTile'
import { useCollectionStore } from '../stores/useCollectionStore'

interface CardGridProps {
  cards: Card[]
  onSelectCard?: (card: Card) => void
  selectionMode?: boolean
  selectedIds?: Set<string>
  onToggleSelection?: (card: Card) => void
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, onSelectCard, selectionMode, selectedIds, onToggleSelection }) => {
  const quantities = useCollectionStore((state) => state.quantities)
  const increment = useCollectionStore((state) => state.increment)
  const decrement = useCollectionStore((state) => state.decrement)
  const setQuantity = useCollectionStore((state) => state.setQuantity)

  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <p>조건에 맞는 카드가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="card-grid">
      {cards.map((card) => {
        const qty = quantities[card.id] ?? 0
        return (
          <CardTile
            key={card.id}
            card={card}
            quantity={qty}
            onSelect={onSelectCard}
            selectionMode={selectionMode}
            isSelected={selectedIds?.has(card.id)}
            onToggleSelection={onToggleSelection}
            onIncrement={() => increment(card.id)}
            onDecrement={() => decrement(card.id)}
            onSetQuantity={(q) => setQuantity(card.id, q)}
          />
        )
      })}
    </div>
  )
}
