import React, { useState, useMemo } from 'react'
import { CardsData, Card } from '../types/card'
import { PackSelector } from '../components/PackSelector'
import { CardGrid } from '../components/CardGrid'
import { CardModal } from '../components/CardModal'
import { getSortedPacks, groupPacksByCategory } from '../utils/packCategories'
import { useCollectionStore } from '../stores/useCollectionStore'
import { CollectionProgress } from '../features/collection/CollectionProgress'
import { CollectionFilter, FilterMode } from '../features/collection/CollectionFilter'
import { RaritySummary } from '../features/collection/RaritySummary'
import { SortMode } from '../stores/useCollectionStore'

interface CardListPageProps {
  data: CardsData
}

export const CardListPage: React.FC<CardListPageProps> = ({ data }) => {
  const sortedPacks = useMemo(() => getSortedPacks(data.packs), [data.packs])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null)

  const quantities = useCollectionStore((state) => state.quantities)
  const storedPackId = useCollectionStore((state) => state.selectedPackId)
  const setStoredPackId = useCollectionStore((state) => state.setSelectedPackId)
  const sortMode = useCollectionStore((state) => state.sortMode)
  const setSortMode = useCollectionStore((state) => state.setSortMode)

  // 저장된 packId가 유효한 팩인지 확인하고, 유효하지 않다면 첫 번째 팩 사용
  const currentPack = useMemo(() => {
    if (!sortedPacks.length) return null
    if (storedPackId) {
      const found = sortedPacks.find((p) => p.id === storedPackId)
      if (found) return found
    }
    return sortedPacks[0]
  }, [sortedPacks, storedPackId])

  // 팩이 변경되면 레어도 퀵 필터 초기화
  React.useEffect(() => {
    setSelectedRarity(null)
  }, [currentPack?.id])

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

  // 필터 및 정렬 적용된 카드 목록
  const displayedCards = useMemo(() => {
    if (!currentPack) return []
    let list = [...currentPack.cards]

    // 1. 보유 / 미보유 필터링
    if (filterMode === 'owned') {
      list = list.filter((card) => (quantities[card.id] ?? 0) > 0)
    } else if (filterMode === 'unowned') {
      list = list.filter((card) => (quantities[card.id] ?? 0) === 0)
    }

    // 2. 레어도 퀵 필터링
    if (selectedRarity) {
      list = list.filter((card) => card.rarity === selectedRarity)
    }

    // 3. 카드 등급 정렬
    if (sortMode === 'rarity-desc') {
      // 등급 높은 순 (MR/SSR -> N/R)
      list.sort((a, b) => {
        const rankDiff = (b.rarityRank ?? 0) - (a.rarityRank ?? 0)
        if (rankDiff !== 0) return rankDiff
        return a.sortOrder - b.sortOrder
      })
    } else if (sortMode === 'rarity-asc') {
      // 등급 낮은 순 (N/R -> MR/SSR)
      list.sort((a, b) => {
        const rankDiff = (a.rarityRank ?? 0) - (b.rarityRank ?? 0)
        if (rankDiff !== 0) return rankDiff
        return a.sortOrder - b.sortOrder
      })
    } else {
      // 기본 순서 (번호순)
      list.sort((a, b) => a.sortOrder - b.sortOrder)
    }

    return list
  }, [currentPack, filterMode, selectedRarity, sortMode, quantities])

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

              {/* 공식 사이트 스타일: 레어도별 종류수 바 */}
              <RaritySummary
                cards={currentPack.cards}
                selectedRarity={selectedRarity}
                onSelectRarity={setSelectedRarity}
              />

              {/* 보유/미보유 필터 탭 & 등급 정렬 컨트롤 */}
              <div className="collection-controls-bar">
                <CollectionFilter
                  currentFilter={filterMode}
                  onFilterChange={setFilterMode}
                  totalCount={currentPack.cards.length}
                  ownedCount={ownedUniqueCount}
                  unownedCount={unownedCount}
                />

                <div className="sort-control-group">
                  <label htmlFor="card-sort-select" className="sort-label">
                    정렬
                  </label>
                  <div className="sort-select-wrapper">
                    <select
                      id="card-sort-select"
                      className="sort-select"
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value as SortMode)}
                    >
                      <option value="default">기본 순서 (번호순)</option>
                      <option value="rarity-desc">등급 높은 순</option>
                      <option value="rarity-asc">등급 낮은 순</option>
                    </select>
                  </div>
                </div>
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
