"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

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
  const [loading, setLoading] = useState(false)

  // Get auth token for API calls
  const getAuthToken = async () => {
    if (!user) return null
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token || null
  }

  // Load wishlist from backend when user logs in
  const loadWishlist = async () => {
    if (!user) {
      setWishlistItems([])
      return
    }

    setLoading(true)
    try {
      const token = await getAuthToken()
      if (!token) {
        setWishlistItems([])
        return
      }

      const response = await fetch("/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Transform backend data to match frontend interface
        const transformedItems = data.items.map((item: any) => ({
          id: item.product_id,
          name: item.name,
          category: item.category,
          price: item.price,
          image: item.image,
          description: item.description,
          rating: item.rating,
          reviews: item.reviews,
          link: item.link,
        }))
        setWishlistItems(transformedItems)
      } else {
        console.error("Failed to load wishlist:", response.statusText)
        setWishlistItems([])
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
      setWishlistItems([])
    } finally {
      setLoading(false)
    }
  }

  // Load wishlist when user changes
  useEffect(() => {
    loadWishlist()
  }, [user])

  const addToWishlist = async (item: WishlistItem) => {
    if (!user) {
      // Store the item they wanted to add for after login
      localStorage.setItem("pendingWishlistItem", JSON.stringify(item))
      throw new Error("REDIRECT_TO_LOGIN")
    }

    try {
      const token = await getAuthToken()
      if (!token) {
        throw new Error("REDIRECT_TO_LOGIN")
      }

      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      })

      if (response.ok) {
        // Add item to local state
        setWishlistItems((prev) => [...prev, item])
      } else if (response.status === 409) {
        // Item already in wishlist - do nothing
        return
      } else {
        console.error("Failed to add to wishlist:", response.statusText)
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
    }
  }

  const removeFromWishlist = async (itemId: number) => {
    if (!user) return

    try {
      const token = await getAuthToken()
      if (!token) return

      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        // Remove item from local state
        setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))
      } else {
        console.error("Failed to remove from wishlist:", response.statusText)
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  const isInWishlist = (itemId: number) => {
    return wishlistItems.some((item) => item.id === itemId)
  }

  const clearWishlist = async () => {
    if (!user) return

    try {
      const token = await getAuthToken()
      if (!token) return

      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        // Clear local state
        setWishlistItems([])
      } else {
        console.error("Failed to clear wishlist:", response.statusText)
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error)
    }
  }

  const addPendingWishlistItem = async () => {
    if (!user) return

    const pendingItem = localStorage.getItem("pendingWishlistItem")
    if (pendingItem) {
      try {
        const item = JSON.parse(pendingItem)
        await addToWishlist(item)
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
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    addPendingWishlistItem,
    refreshWishlist: loadWishlist,
  }
}
