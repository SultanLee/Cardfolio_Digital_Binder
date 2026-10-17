import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type SortMode = 'default' | 'rarity-desc' | 'rarity-asc'

export interface CollectionState {
  // cardId -> 보유 수량 (0 이상 정수)
  quantities: Record<string, number>
  // 마지막으로 선택된 부스터팩 ID
  selectedPackId: string | null
  setSelectedPackId: (packId: string) => void
  // 전체 카드, category:<시리즈 ID>, 개별 팩 ID
  selectedCardScope: string
  setSelectedCardScope: (value: string) => void
  // 카드 정렬 옵션: 'default' | 'rarity-desc' | 'rarity-asc'
  sortMode: SortMode
  setSortMode: (mode: SortMode) => void
  getQuantity: (cardId: string) => number
  setQuantity: (cardId: string, quantity: number) => void
  increment: (cardId: string) => void
  decrement: (cardId: string) => void
  resetPackQuantities: (cardIds: string[]) => void
  // 최근 일괄 추가의 이전 수량. 새로고침 시에는 보관하지 않는다.
  lastBulkChange: Record<string, number> | null
  incrementMany: (cardIds: string[]) => void
  undoBulkChange: () => void
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      quantities: {},
      selectedPackId: null,
      selectedCardScope: 'all',
      sortMode: 'default',
      lastBulkChange: null,

      setSelectedPackId: (packId: string) => {
        set({ selectedPackId: packId, selectedCardScope: packId })
      },

      setSelectedCardScope: (value: string) => {
        set({
          selectedCardScope: value,
          ...(value.startsWith('pack-') ? { selectedPackId: value } : {}),
        })
      },

      setSortMode: (mode: SortMode) => {
        set({ sortMode: mode })
      },

      getQuantity: (cardId: string) => {
        return get().quantities[cardId] ?? 0
      },

      setQuantity: (cardId: string, quantity: number) => {
        const safeQty = Math.max(0, Math.floor(isNaN(quantity) ? 0 : quantity))
        set((state) => {
          if ((state.quantities[cardId] ?? 0) === safeQty) return state
          const lastBulkChange = state.lastBulkChange && cardId in state.lastBulkChange
            ? null : state.lastBulkChange
          if (safeQty === 0) {
            // 수량이 0이면 객체에서 제거하여 storage 크기 절약
            const next = { ...state.quantities }
            delete next[cardId]
            return { quantities: next, lastBulkChange }
          }
          return {
            quantities: {
              ...state.quantities,
              [cardId]: safeQty,
            },
            lastBulkChange,
          }
        })
      },

      increment: (cardId: string) => {
        const current = get().quantities[cardId] ?? 0
        get().setQuantity(cardId, current + 1)
      },

      decrement: (cardId: string) => {
        const current = get().quantities[cardId] ?? 0
        get().setQuantity(cardId, Math.max(0, current - 1))
      },

      resetPackQuantities: (cardIds: string[]) => {
        set((state) => {
          const next = { ...state.quantities }
          const previous = state.lastBulkChange
          for (const id of cardIds) {
            delete next[id]
          }
          return {
            quantities: next,
            lastBulkChange: previous && cardIds.some((id) => id in previous) ? null : previous,
          }
        })
      },

      incrementMany: (cardIds: string[]) => {
        const uniqueIds = [...new Set(cardIds)]
        if (uniqueIds.length === 0) return
        set((state) => {
          const quantities = { ...state.quantities }
          const previous: Record<string, number> = {}
          for (const id of uniqueIds) {
            previous[id] = quantities[id] ?? 0
            quantities[id] = previous[id] + 1
          }
          return { quantities, lastBulkChange: previous }
        })
      },

      undoBulkChange: () => {
        set((state) => {
          if (!state.lastBulkChange) return state
          const quantities = { ...state.quantities }
          for (const [id, quantity] of Object.entries(state.lastBulkChange)) {
            if (quantity === 0) delete quantities[id]
            else quantities[id] = quantity
          }
          return { quantities, lastBulkChange: null }
        })
      },
    }),
    {
      name: 'cardfolio-collection-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ quantities, selectedPackId, selectedCardScope, sortMode }) => ({
        quantities, selectedPackId, selectedCardScope, sortMode,
      }),
    }
  )
)
