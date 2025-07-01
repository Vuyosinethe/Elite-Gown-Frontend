"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export interface WishlistItem {
  id: number
  name: string
  category: string
  price: number
  image: string
  description: string
  rating: number
  reviews: number
  link: string
}

export function useWishlist() {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage when user logs in
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`)
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist))
        } catch (error) {
          console.error("Error loading wishlist:", error)
          setWishlistItems([])
        }
      }
    } else {
      setWishlistItems([])
    }
  }, [user])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user && wishlistItems.length >= 0) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, user])

  const addToWishlist = (item: WishlistItem) => {
    if (!user) {
      // Store the item they wanted to add for after login
      localStorage.setItem("pendingWishlistItem", JSON.stringify(item))
      throw new Error("REDIRECT_TO_LOGIN")
    }

    // Check if item already exists
    const existingItem = wishlistItems.find((wishlistItem) => wishlistItem.id === item.id)
    if (existingItem) {
      return // Item already in wishlist
    }

    setWishlistItems((prev) => [...prev, item])
  }

  const removeFromWishlist = (itemId: number) => {
    if (!user) return

    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const isInWishlist = (itemId: number) => {
    return wishlistItems.some((item) => item.id === itemId)
  }

  const clearWishlist = () => {
    if (!user) return
    setWishlistItems([])
  }

  const addPendingWishlistItem = () => {
    if (!user) return

    const pendingItem = localStorage.getItem("pendingWishlistItem")
    if (pendingItem) {
      try {
        const item = JSON.parse(pendingItem)
        addToWishlist(item)
        localStorage.removeItem("pendingWishlistItem")
      } catch (error) {
        console.error("Error adding pending wishlist item:", error)
        localStorage.removeItem("pendingWishlistItem")
      }
    }
  }

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    addPendingWishlistItem,
  }
}
