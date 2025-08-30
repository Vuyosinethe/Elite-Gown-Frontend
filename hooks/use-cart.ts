"use client"

import { useState, useEffect } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever items change
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, loading])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prevItems, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const cartCount = items.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  }
}
