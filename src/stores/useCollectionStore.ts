import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type SortMode = 'default' | 'rarity-desc' | 'rarity-asc'

export interface CollectionState {
  // cardId -> 보유 수량 (0 이상 정수)
  quantities: Record<string, number>
  // 마지막으로 선택된 부스터팩 ID
  selectedPackId: string | null
  setSelectedPackId: (packId: string) => void
  // 카드 정렬 옵션: 'default' | 'rarity-desc' | 'rarity-asc'
  sortMode: SortMode
  setSortMode: (mode: SortMode) => void
  getQuantity: (cardId: string) => number
  setQuantity: (cardId: string, quantity: number) => void
  increment: (cardId: string) => void
  decrement: (cardId: string) => void
  resetPackQuantities: (cardIds: string[]) => void
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      quantities: {},
      selectedPackId: null,
      sortMode: 'default',

      setSelectedPackId: (packId: string) => {
        set({ selectedPackId: packId })
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
          if (safeQty === 0) {
            // 수량이 0이면 객체에서 제거하여 storage 크기 절약
            const next = { ...state.quantities }
            delete next[cardId]
            return { quantities: next }
          }
          return {
            quantities: {
              ...state.quantities,
              [cardId]: safeQty,
            },
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
          for (const id of cardIds) {
            delete next[id]
          }
          return { quantities: next }
        })
      },
    }),
    {
      name: 'cardfolio-collection-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
