import React from 'react'
import { Card } from '../../types/card'
import { useWishlistStore } from '../../stores/useWishlistStore'
import { WishlistTile } from './WishlistTile'

interface WishedCardItem {
  card: Card
  packName: string
}

interface WishlistGridProps {
  wishedCards: WishedCardItem[]
  onSelectCard: (card: Card) => void
}

export const WishlistGrid: React.FC<WishlistGridProps> = ({
  wishedCards,
  onSelectCard,
}) => {
  const setWishQuantity = useWishlistStore((state) => state.setWishQuantity)
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist)
  const wishes = useWishlistStore((state) => state.wishes)

  return (
    <div className="wishlist-grid">
      {wishedCards.map(({ card, packName }) => (
        <WishlistTile
          key={card.id}
          card={card}
          packName={packName}
          targetQty={wishes[card.id] ?? 1}
          onSelect={() => onSelectCard(card)}
          onSetTargetQty={(qty) => setWishQuantity(card.id, qty)}
          onRemove={() => removeFromWishlist(card.id)}
        />
      ))}
    </div>
  )
}
