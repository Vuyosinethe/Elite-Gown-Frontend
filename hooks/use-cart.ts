"use client"

import { useState, useEffect } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        localStorage.removeItem("cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = async (item: Omit<CartItem, "quantity">) => {
    setIsLoading(true)
    try {
      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color,
        )

        if (existingItem) {
          return currentItems.map((i) =>
            i.id === item.id && i.size === item.size && i.color === item.color ? { ...i, quantity: i.quantity + 1 } : i,
          )
        }

        return [...currentItems, { ...item, quantity: 1 }]
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (id: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      await removeItem(id, size, color)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.size === size && item.color === color ? { ...item, quantity } : item,
      ),
    )
  }

  const removeItem = async (id: string, size?: string, color?: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => !(item.id === id && item.size === size && item.color === color)),
    )
  }

  const clearCart = async () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    total,
    isLoading,
  }
}
