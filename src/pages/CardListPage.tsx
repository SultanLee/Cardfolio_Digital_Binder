import React, { useState, useMemo } from 'react'
import { CardsData, Card } from '../types/card'
import { PackSelector } from '../components/PackSelector'
import { CardGrid } from '../components/CardGrid'
import { CardModal } from '../components/CardModal'
import { getSortedPacks, groupPacksByCategory } from '../utils/packCategories'
import { useCollectionStore } from '../stores/useCollectionStore'
import { CollectionProgress } from '../features/collection/CollectionProgress'
import { CollectionFilter, FilterMode } from '../features/collection/CollectionFilter'

interface CardListPageProps {
  data: CardsData
}

export const CardListPage: React.FC<CardListPageProps> = ({ data }) => {
  const sortedPacks = useMemo(() => getSortedPacks(data.packs), [data.packs])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [filterMode, setFilterMode] = useState<FilterMode>('all')

  const quantities = useCollectionStore((state) => state.quantities)
  const storedPackId = useCollectionStore((state) => state.selectedPackId)
  const setStoredPackId = useCollectionStore((state) => state.setSelectedPackId)

  // 저장된 packId가 유효한 팩인지 확인하고, 유효하지 않다면 첫 번째 팩 사용
  const currentPack = useMemo(() => {
    if (!sortedPacks.length) return null
    if (storedPackId) {
      const found = sortedPacks.find((p) => p.id === storedPackId)
      if (found) return found
    }
    return sortedPacks[0]
  }, [sortedPacks, storedPackId])

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

  // 현재 팩의 카드별 보유 현황 계산 (AGENTS.md: 진척도는 카드 '종류' 기준)
  const { ownedUniqueCount, totalOwnedCount, unownedCount } = useMemo(() => {
    if (!currentPack) {
      return { ownedUniqueCount: 0, totalOwnedCount: 0, unownedCount: 0 }
    }
    let ownedUnique = 0
    let totalOwned = 0
    for (const card of currentPack.cards) {
      const qty = quantities[card.id] ?? 0
      if (qty > 0) {
        ownedUnique += 1
        totalOwned += qty
      }
    }
    return {
      ownedUniqueCount: ownedUnique,
      totalOwnedCount: totalOwned,
      unownedCount: currentPack.cards.length - ownedUnique,
    }
  }, [currentPack, quantities])

  // 필터 적용된 카드 목록
  const displayedCards = useMemo(() => {
    if (!currentPack) return []
    if (filterMode === 'owned') {
      return currentPack.cards.filter((card) => (quantities[card.id] ?? 0) > 0)
    }
    if (filterMode === 'unowned') {
      return currentPack.cards.filter((card) => (quantities[card.id] ?? 0) === 0)
    }
    return currentPack.cards
  }, [currentPack, filterMode, quantities])

  return (
    <div className="card-list-page">
      <header className="page-header">
        <div className="header-content">
          {sortedPacks.length > 0 && (
            <PackSelector
              packs={sortedPacks}
              selectedPackId={currentPack?.id || ''}
              onSelectPack={(packId) => {
                setStoredPackId(packId)
              }}
            />
          )}
        </div>
      </header>

      <main className="page-body">
        {currentPack ? (
          <>
            <section className="pack-dashboard">
              <div className="pack-header-bar">
                <div className="pack-info">
                  {currentCategoryName && (
                    <span className="pack-category-badge">
                      {currentCategoryName}
                    </span>
                  )}
                  <h2 className="current-pack-name">{currentPack.name}</h2>
                  <span className="pack-card-count-badge">
                    전체 {currentPack.cards.length}장
                  </span>
                </div>
              </div>

              {/* 수집 진척도 프로그레스 바 */}
              <CollectionProgress
                totalCount={currentPack.cards.length}
                ownedUniqueCount={ownedUniqueCount}
                totalOwnedCount={totalOwnedCount}
              />

              {/* 보유 / 미보유 필터 탭 */}
              <div className="collection-filter-wrapper">
                <CollectionFilter
                  currentFilter={filterMode}
                  onFilterChange={setFilterMode}
                  totalCount={currentPack.cards.length}
                  ownedCount={ownedUniqueCount}
                  unownedCount={unownedCount}
                />
              </div>
            </section>

            <CardGrid
              cards={displayedCards}
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
