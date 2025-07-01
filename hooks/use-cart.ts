"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

interface CartItem {
  id: number
  name: string
  details: string
  price: number
  quantity: number
  image: string
}

export function useCart() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart items from localStorage when user logs in
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`elite-gowns-cart-${user.id}`)
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      } else {
        // Mock cart items for demo - remove in production
        setCartItems([
          {
            id: 1,
            name: "Complete Graduation Set",
            details: "Size: M, Faculty: Commerce (Red)",
            price: 1299,
            quantity: 1,
            image: "/placeholder.svg?height=80&width=80",
          },
          {
            id: 2,
            name: "Professional Medical Scrubs Set",
            details: "Size: L, Color: Navy Blue",
            price: 899,
            quantity: 1,
            image: "/placeholder.svg?height=80&width=80",
          },
        ])
      }
    } else {
      // Clear cart when user logs out
      setCartItems([])
    }
  }, [user])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && cartItems.length > 0) {
      localStorage.setItem(`elite-gowns-cart-${user.id}`, JSON.stringify(cartItems))
    }
  }, [cartItems, user])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    if (!user) {
      // Store the current page URL for redirect after login
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search)
        localStorage.setItem("pendingCartItem", JSON.stringify(item))
      }
      throw new Error("REDIRECT_TO_LOGIN")
    }

    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (!user) return

    if (newQuantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeFromCart = (id: number) => {
    if (!user) return
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    if (!user) return
    setCartItems([])
    localStorage.removeItem(`elite-gowns-cart-${user.id}`)
  }

  const addPendingCartItem = () => {
    if (typeof window !== "undefined") {
      const pendingItem = localStorage.getItem("pendingCartItem")
      if (pendingItem && user) {
        try {
          const item = JSON.parse(pendingItem)
          addToCart(item)
          localStorage.removeItem("pendingCartItem")
        } catch (error) {
          console.error("Error adding pending cart item:", error)
        }
      }
    }
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vat = subtotal * 0.15
  const total = subtotal + vat

  return {
    cartItems,
    cartCount,
    subtotal,
    vat,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    addPendingCartItem,
    isAuthenticated: !!user,
  }
}
