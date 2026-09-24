import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface WishlistState {
  // cardId -> 목표 수량 (1 이상 정수). 위시리스트에 없는 카드는 키가 없음.
  wishes: Record<string, number>

  isWished: (cardId: string) => boolean
  getWishQuantity: (cardId: string) => number
  addToWishlist: (cardId: string, targetQty?: number) => void
  removeFromWishlist: (cardId: string) => void
  toggleWishlist: (cardId: string) => void
  setWishQuantity: (cardId: string, qty: number) => void
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishes: {},

      isWished: (cardId: string) => {
        return cardId in get().wishes
      },

      getWishQuantity: (cardId: string) => {
        return get().wishes[cardId] ?? 1
      },

      addToWishlist: (cardId: string, targetQty = 1) => {
        const safeQty = Math.max(1, Math.floor(isNaN(targetQty) ? 1 : targetQty))
        set((state) => ({
          wishes: { ...state.wishes, [cardId]: safeQty },
        }))
      },

      removeFromWishlist: (cardId: string) => {
        set((state) => {
          const next = { ...state.wishes }
          delete next[cardId]
          return { wishes: next }
        })
      },

      toggleWishlist: (cardId: string) => {
        if (get().isWished(cardId)) {
          get().removeFromWishlist(cardId)
        } else {
          get().addToWishlist(cardId)
        }
      },

      setWishQuantity: (cardId: string, qty: number) => {
        const safeQty = Math.max(1, Math.floor(isNaN(qty) ? 1 : qty))
        if (!get().isWished(cardId)) return
        set((state) => ({
          wishes: { ...state.wishes, [cardId]: safeQty },
        }))
      },

      clearWishlist: () => {
        set({ wishes: {} })
      },
    }),
    {
      name: 'cardfolio-wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
