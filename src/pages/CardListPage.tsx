import React, { useState, useMemo } from 'react'
import { CardsData, Card } from '../types/card'
import { PackSelector } from '../components/PackSelector'
import { CardGrid } from '../components/CardGrid'
import { CardModal } from '../components/CardModal'
import { getSortedPacks, groupPacksByCategory } from '../utils/packCategories'

interface CardListPageProps {
  data: CardsData
}

export const CardListPage: React.FC<CardListPageProps> = ({ data }) => {
  const sortedPacks = useMemo(() => getSortedPacks(data.packs), [data.packs])
  const [selectedPackId, setSelectedPackId] = useState<string>(
    sortedPacks[0]?.id || ''
  )
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const currentPack = useMemo(() => {
    return (
      sortedPacks.find((p) => p.id === selectedPackId) || sortedPacks[0]
    )
  }, [sortedPacks, selectedPackId])

  // 현재 팩의 카테고리명 찾기
  const currentCategoryName = useMemo(() => {
    if (!currentPack) return ''
    const groups = groupPacksByCategory(sortedPacks)
    for (const group of groups) {
      if (group.packs.some((p) => p.id === currentPack.id)) {
        return group.categoryName
      }
    }
    return ''
  }, [sortedPacks, currentPack])

  return (
    <div className="card-list-page">
      <header className="page-header">
        <div className="header-content">
          <div className="title-area">
            <h1 className="app-title">Cardfolio</h1>
            <p className="app-subtitle">
              아이돌마스터 카드폴리오 컬렉션 뷰어
            </p>
          </div>
          {sortedPacks.length > 0 && (
            <PackSelector
              packs={sortedPacks}
              selectedPackId={currentPack?.id || ''}
              onSelectPack={setSelectedPackId}
            />
          )}
        </div>
      </header>

      <main className="page-body">
        {currentPack ? (
          <>
            <div className="pack-header-bar">
              <div className="pack-info">
                {currentCategoryName && (
                  <span className="pack-category-badge">
                    {currentCategoryName}
                  </span>
                )}
                <h2 className="current-pack-name">{currentPack.name}</h2>
                <span className="pack-card-count-badge">
                  총 {currentPack.cards.length}장
                </span>
              </div>
            </div>

            <CardGrid
              cards={currentPack.cards}
              onSelectCard={(card) => setSelectedCard(card)}
            />
          </>
        ) : (
          <div className="empty-state">
            <p>등록된 부스터팩이 없습니다.</p>
          </div>
        )}
      </main>

      <CardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  )
}
