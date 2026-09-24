import React, { useEffect } from 'react'
import { Card } from '../types/card'
import { useWishlistStore } from '../stores/useWishlistStore'

interface CardModalProps {
  card: Card | null
  onClose: () => void
}

export const CardModal: React.FC<CardModalProps> = ({ card, onClose }) => {
  const isWished = useWishlistStore((state) => (card ? state.isWished(card.id) : false))
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (card) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [card, onClose])

  if (!card) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="닫기"
        >
          ✕
        </button>

        <div className="modal-image-wrapper">
          <img
            src={card.imagePath}
            alt="카드 상세 이미지"
            className="modal-image"
          />
        </div>

        {/* 위시리스트 버튼 */}
        <div className="modal-footer">
          <button
            className={`modal-wishlist-btn ${isWished ? 'is-wished' : ''}`}
            onClick={() => toggleWishlist(card.id)}
            aria-label={isWished ? '위시 리스트에서 제거' : '위시 리스트에 추가'}
          >
            <span className="modal-wishlist-icon">{isWished ? '♥' : '♡'}</span>
            <span>{isWished ? '위시 리스트에서 제거' : '위시 리스트에 추가'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
