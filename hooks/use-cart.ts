"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"

interface CartItem {
  id: number
  product_id: number
  product_name: string
  product_details: string
  product_image: string
  price: number
  quantity: number
  created_at: string
  updated_at: string
}

export function useCart() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Load cart items from localStorage
  const loadCartFromStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const storedCart = localStorage.getItem("cart_items")
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart)
          setCartItems(parsedCart)
        }
      } catch (error) {
        console.error("Error loading cart from storage:", error)
        setCartItems([])
      }
    }
  }, [])

  // Save cart items to localStorage
  const saveCartToStorage = useCallback((items: CartItem[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cart_items", JSON.stringify(items))
      } catch (error) {
        console.error("Error saving cart to storage:", error)
      }
    }
  }, [])

  // Load cart items on component mount
  useEffect(() => {
    loadCartFromStorage()
  }, [loadCartFromStorage])

  // Add item to cart
  const addToCart = async (item: {
    id: number
    name: string
    details: string
    price: number
    image: string
    quantity?: number
  }) => {
    try {
      const newItem: CartItem = {
        id: Date.now(), // Use timestamp as unique ID for frontend-only cart
        product_id: item.id,
        product_name: item.name,
        product_details: item.details,
        product_image: item.image,
        price: item.price,
        quantity: item.quantity || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.product_id === item.id && cartItem.product_details === item.details,
      )

      let updatedCart: CartItem[]

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedCart = cartItems.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1), updated_at: new Date().toISOString() }
            : cartItem,
        )
      } else {
        // Add new item to cart
        updatedCart = [...cartItems, newItem]
      }

      setCartItems(updatedCart)
      saveCartToStorage(updatedCart)

      return { success: true, message: "Item added to cart successfully" }
    } catch (error) {
      console.error("Error adding to cart:", error)
      return { success: false, error: "Failed to add item to cart" }
    }
  }

  // Update item quantity
  const updateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      if (newQuantity < 1) {
        return removeFromCart(itemId)
      }

      const updatedCart = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity, updated_at: new Date().toISOString() } : item,
      )

      setCartItems(updatedCart)
      saveCartToStorage(updatedCart)

      return { success: true }
    } catch (error) {
      console.error("Error updating quantity:", error)
      return { success: false, error: "Failed to update quantity" }
    }
  }

  // Remove item from cart
  const removeFromCart = async (itemId: number) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== itemId)
      setCartItems(updatedCart)
      saveCartToStorage(updatedCart)

      return { success: true }
    } catch (error) {
      console.error("Error removing from cart:", error)
      return { success: false, error: "Failed to remove item from cart" }
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    try {
      setCartItems([])
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart_items")
      }
      return { success: true }
    } catch (error) {
      console.error("Error clearing cart:", error)
      return { success: false, error: "Failed to clear cart" }
    }
  }

  // Add pending cart item (for post-login processing)
  const addPendingCartItem = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        const pendingItem = localStorage.getItem("pending_cart_item")
        if (pendingItem) {
          const item = JSON.parse(pendingItem)
          addToCart(item)
          localStorage.removeItem("pending_cart_item")
          console.log("Added pending cart item after login")
        }
      }
    } catch (error) {
      console.error("Error adding pending cart item:", error)
    }
  }, [])

  // Store item for later addition (when user logs in)
  const storePendingCartItem = useCallback(
    (item: {
      id: number
      name: string
      details: string
      price: number
      image: string
      quantity?: number
    }) => {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("pending_cart_item", JSON.stringify(item))
        }
      } catch (error) {
        console.error("Error storing pending cart item:", error)
      }
    },
    [],
  )

  // Calculate totals
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
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: loadCartFromStorage,
    addPendingCartItem,
    storePendingCartItem,
    isAuthenticated: !!user,
  }
}
