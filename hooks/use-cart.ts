"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

interface CartStore {
  items: CartItem[]
  cartCount: number
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartCount: 0,
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          set({
            items: items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            cartCount: get().cartCount + 1,
          })
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
            cartCount: get().cartCount + 1,
          })
        }
      },
      removeItem: (id) => {
        const items = get().items
        const item = items.find((i) => i.id === id)
        if (item) {
          set({
            items: items.filter((i) => i.id !== id),
            cartCount: get().cartCount - item.quantity,
          })
        }
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        const items = get().items
        const item = items.find((i) => i.id === id)
        if (item) {
          const diff = quantity - item.quantity
          set({
            items: items.map((i) => (i.id === id ? { ...i, quantity } : i)),
            cartCount: get().cartCount + diff,
          })
        }
      },
      clearCart: () => set({ items: [], cartCount: 0 }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recalculate cart count after rehydration
          const totalCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
          state.cartCount = totalCount
        }
      },
    },
  ),
)
