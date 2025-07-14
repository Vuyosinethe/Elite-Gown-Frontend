"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface CartItem {
  id: string
  name: string
  price: number // Price in cents
  image?: string
  quantity: number
}

interface CartState {
  cartItems: CartItem[]
  cartTotal: number
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      cartTotal: 0,
      addToCart: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.cartItems.find((cartItem) => cartItem.id === item.id)
          let updatedItems

          if (existingItem) {
            updatedItems = state.cartItems.map((cartItem) =>
              cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem,
            )
          } else {
            updatedItems = [...state.cartItems, { ...item, quantity }]
          }

          const newTotal = updatedItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0)

          return { cartItems: updatedItems, cartTotal: newTotal }
        })
      },
      removeFromCart: (id) => {
        set((state) => {
          const updatedItems = state.cartItems.filter((cartItem) => cartItem.id !== id)
          const newTotal = updatedItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0)
          return { cartItems: updatedItems, cartTotal: newTotal }
        })
      },
      updateQuantity: (id, quantity) => {
        set((state) => {
          const updatedItems = state.cartItems
            .map((cartItem) => (cartItem.id === id ? { ...cartItem, quantity } : cartItem))
            .filter((cartItem) => cartItem.quantity > 0) // Remove if quantity drops to 0 or less

          const newTotal = updatedItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0)
          return { cartItems: updatedItems, cartTotal: newTotal }
        })
      },
      clearCart: () => set({ cartItems: [], cartTotal: 0 }),
    }),
    {
      name: "elite-gowns-cart-storage", // unique name
      storage: createJSONStorage(() => localStorage), // Use localStorage
    },
  ),
)
