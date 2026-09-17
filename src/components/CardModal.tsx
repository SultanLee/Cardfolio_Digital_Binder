import React, { useEffect } from 'react'
import { Card } from '../types/card'

interface CardModalProps {
  card: Card | null
  onClose: () => void
}

export const CardModal: React.FC<CardModalProps> = ({ card, onClose }) => {
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
      </div>
    </div>
  )
}
