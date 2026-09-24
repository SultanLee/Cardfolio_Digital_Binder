import React, { useState, useMemo } from 'react'
import { CardsData, Card } from '../types/card'
import { CardModal } from '../components/CardModal'
import { useWishlistStore } from '../stores/useWishlistStore'
import { WishlistGrid } from '../features/wishlist/WishlistGrid'

interface WishlistPageProps {
  data: CardsData
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ data }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const wishes = useWishlistStore((state) => state.wishes)
  const clearWishlist = useWishlistStore((state) => state.clearWishlist)

  // 위시리스트에 있는 카드를 전체 데이터에서 조회 (팩 순서 유지)
  const wishedCards = useMemo(() => {
    const result: { card: Card; packName: string }[] = []
    for (const pack of data.packs) {
      for (const card of pack.cards) {
        if (card.id in wishes) {
          result.push({ card, packName: pack.name })
        }
      }
    }
    return result
  }, [data.packs, wishes])

  const wishCount = wishedCards.length

  return (
    <div className="wishlist-page">
      <section className="wishlist-dashboard">
        <div className="wishlist-header-bar">
          <div className="wishlist-title-area">
            <h2 className="wishlist-title">위시 리스트</h2>
            <span className="wishlist-count-badge">{wishCount}장</span>
          </div>
          {wishCount > 0 && (
            <button
              className="wishlist-clear-btn"
              onClick={() => {
                if (window.confirm('위시 리스트를 전부 비우시겠어요?')) {
                  clearWishlist()
                }
              }}
            >
              전체 삭제
            </button>
          )}
        </div>
      </section>

      {wishCount === 0 ? (
        <div className="wishlist-empty-state">
          <div className="wishlist-empty-icon">♡</div>
          <p className="wishlist-empty-text">위시 리스트가 비어 있어요.</p>
          <p className="wishlist-empty-hint">
            카드 목록 화면에서 카드를 클릭한 뒤 ♡ 버튼을 눌러 추가해 보세요.
          </p>
        </div>
      ) : (
        <WishlistGrid
          wishedCards={wishedCards}
          onSelectCard={(card) => setSelectedCard(card)}
        />
      )}

      <CardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  )
}
