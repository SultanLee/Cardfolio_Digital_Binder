import React, { useState } from 'react'
import { Card } from '../../types/card'
import { useCollectionStore } from '../../stores/useCollectionStore'
import { useWishlistStore } from '../../stores/useWishlistStore'

interface SelectionProps {
  selectionMode: boolean
  selectedIds: Set<string>
  onToggleSelection: (card: Card) => void
}

interface BulkCollectionControlsProps {
  visibleCards: Card[]
  children: (selection: SelectionProps) => React.ReactNode
}

export const BulkCollectionControls: React.FC<BulkCollectionControlsProps> = ({ visibleCards, children }) => {
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [message, setMessage] = useState('')
  const [wishlistMessage, setWishlistMessage] = useState('')
  const lastBulkChange = useCollectionStore((state) => state.lastBulkChange)
  const incrementMany = useCollectionStore((state) => state.incrementMany)
  const undoBulkChange = useCollectionStore((state) => state.undoBulkChange)
  const lastBulkAddition = useWishlistStore((state) => state.lastBulkAddition)
  const addManyToWishlist = useWishlistStore((state) => state.addManyToWishlist)
  const undoBulkAddition = useWishlistStore((state) => state.undoBulkAddition)
  const allVisibleSelected = visibleCards.length > 0 && visibleCards.every((card) => selectedIds.has(card.id))

  const finishSelection = () => {
    setSelectionMode(false)
    setSelectedIds(new Set())
  }
  const onToggleSelection = (card: Card) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (next.has(card.id)) next.delete(card.id)
      else next.add(card.id)
      return next
    })
  }
  const toggleVisible = () => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      for (const card of visibleCards) {
        if (allVisibleSelected) next.delete(card.id)
        else next.add(card.id)
      }
      return next
    })
  }
  const addSelected = () => {
    if (selectedIds.size === 0) return
    incrementMany([...selectedIds])
    setSelectedIds(new Set())
    setMessage('')
  }
  const undo = () => {
    const count = Object.keys(lastBulkChange ?? {}).length
    undoBulkChange()
    setMessage(`${count.toLocaleString('ko-KR')}종의 보유 수량 추가를 되돌렸습니다.`)
  }
  const addSelectedToWishlist = () => {
    if (selectedIds.size === 0) return
    const count = addManyToWishlist([...selectedIds])
    setSelectedIds(new Set())
    setWishlistMessage(count === 0 ? '선택한 카드는 모두 이미 위시 리스트에 있습니다.' : '')
  }
  const undoWishlist = () => {
    const count = lastBulkAddition?.length ?? 0
    undoBulkAddition()
    setWishlistMessage(`${count.toLocaleString('ko-KR')}종의 위시 리스트 추가를 되돌렸습니다.`)
  }
  const feedback = (
    <>
      <div className="bulk-feedback">
        <span role="status" aria-live="polite" aria-atomic="true">
          {lastBulkChange
            ? `보유 수량: ${Object.keys(lastBulkChange).length.toLocaleString('ko-KR')}종에 각 1장을 추가했습니다.`
            : message}
        </span>
        {lastBulkChange && <button type="button" onClick={undo} aria-label="보유 수량 추가 되돌리기"
          title="최근 일괄 추가 1회를 취소합니다. 대상 수량을 직접 수정하거나 새로고침하면 되돌리기가 해제됩니다.">되돌리기</button>}
      </div>
      <div className="bulk-feedback">
        <span role="status" aria-live="polite" aria-atomic="true">
          {lastBulkAddition ? `위시 리스트: ${lastBulkAddition.length.toLocaleString('ko-KR')}종을 추가했습니다.` : wishlistMessage}
        </span>
        {lastBulkAddition && <button type="button" onClick={undoWishlist} aria-label="위시 리스트 추가 되돌리기"
          title="최근 위시 리스트 일괄 추가를 취소합니다. 대상 카드를 수정하거나 새로고침하면 되돌리기가 해제됩니다.">되돌리기</button>}
      </div>
      {lastBulkAddition && wishlistMessage && <p className="bulk-feedback" role="status">{wishlistMessage}</p>}
    </>
  )

  return (
    <div className={selectionMode ? 'bulk-collection is-selecting' : 'bulk-collection'}>
      <div className="bulk-selection-heading">
        <button type="button" className="bulk-mode-button" aria-pressed={selectionMode}
          disabled={!selectionMode && visibleCards.length === 0}
          onClick={() => selectionMode ? finishSelection() : setSelectionMode(true)}>
          {selectionMode ? '선택 종료' : '여러 장 선택'}
        </button>
        <span className="bulk-selection-hint">
          {selectionMode ? '카드를 눌러 선택하세요. 검색·필터 변경 시 선택이 해제됩니다.' : '선택한 카드의 보유 수량이나 위시 리스트를 한 번에 추가합니다.'}
        </span>
      </div>
      {!selectionMode && feedback}
      {children({ selectionMode, selectedIds, onToggleSelection })}
      {selectionMode && (
        <div className="bulk-action-bar" role="region" aria-label="선택 카드 일괄 수정">
          <div className="bulk-action-summary">
            <strong role="status" aria-live="polite">{selectedIds.size.toLocaleString('ko-KR')}종 선택</strong>
            <span>다른 페이지에서 선택한 카드도 포함</span>
          </div>
          <div className="bulk-action-buttons">
            <button type="button" onClick={toggleVisible} disabled={visibleCards.length === 0}>
              {allVisibleSelected ? '현재 페이지 선택 해제' : '현재 페이지 전체 선택'}
            </button>
            <button type="button" onClick={() => setSelectedIds(new Set())} disabled={selectedIds.size === 0}>선택 비우기</button>
            <button type="button" className="bulk-add-button" onClick={addSelected} disabled={selectedIds.size === 0}>각 1장씩 추가</button>
            <button type="button" className="bulk-wishlist-button" onClick={addSelectedToWishlist}
              disabled={selectedIds.size === 0} title="새 카드만 목표 1장으로 추가하고, 기존 목표 수량은 유지합니다.">위시 리스트에 추가</button>
            <button type="button" onClick={finishSelection}>선택 종료</button>
          </div>
          {feedback}
        </div>
      )}
    </div>
  )
}
