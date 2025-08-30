"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"

interface WishlistItem {
  id: number
  user_id: string
  product_id: string
  name: string
  category: string
  price: number
  image: string
  description?: string
  rating?: number
  reviews?: number
  link?: string
  created_at: string
  updated_at: string
}

export function useWishlist() {
  const { user, session } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)

  // Load wishlist items from localStorage for guest users
  const loadWishlistFromStorage = useCallback(() => {
    if (typeof window !== "undefined" && !user) {
      try {
        const storedWishlist = localStorage.getItem("wishlist_items")
        if (storedWishlist) {
          const parsedWishlist = JSON.parse(storedWishlist)
          setWishlistItems(parsedWishlist)
        }
      } catch (error) {
        console.error("Error loading wishlist from storage:", error)
        setWishlistItems([])
      }
    }
  }, [user])

  // Save wishlist items to localStorage for guest users
  const saveWishlistToStorage = useCallback(
    (items: WishlistItem[]) => {
      if (typeof window !== "undefined" && !user) {
        try {
          localStorage.setItem("wishlist_items", JSON.stringify(items))
        } catch (error) {
          console.error("Error saving wishlist to storage:", error)
        }
      }
    },
    [user],
  )

  // Load wishlist items from server for authenticated users
  const loadWishlistFromServer = useCallback(async () => {
    if (!user || !session) return

    setLoading(true)
    try {
      const response = await fetch("/api/wishlist", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setWishlistItems(data.items || [])
      } else {
        const errorData = await response.json()
        console.error("Failed to load wishlist from server:", errorData)
        // Fallback to localStorage
        loadWishlistFromStorage()
      }
    } catch (error) {
      console.error("Error loading wishlist from server:", error)
      // Fallback to localStorage
      loadWishlistFromStorage()
    } finally {
      setLoading(false)
    }
  }, [user, session, loadWishlistFromStorage])

  // Load wishlist on component mount and when user changes
  useEffect(() => {
    if (user) {
      loadWishlistFromServer()
    } else {
      loadWishlistFromStorage()
    }
  }, [user, loadWishlistFromServer, loadWishlistFromStorage])

  // Add item to wishlist
  const addToWishlist = async (item: {
    id?: number | string
    product_id?: string
    name: string
    category: string
    price: number
    image: string
    description?: string
    rating?: number
    reviews?: number
    link?: string
  }) => {
    try {
      const productId = item.product_id || item.id?.toString() || Date.now().toString()

      // Check if item already exists
      const existingItem = wishlistItems.find((wishlistItem) => wishlistItem.product_id === productId)
      if (existingItem) {
        return { success: false, error: "Item already in wishlist" }
      }

      if (user && session) {
        // Add to server for authenticated users
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            product_id: productId,
            name: item.name,
            category: item.category,
            price: item.price,
            image: item.image,
            description: item.description,
            rating: item.rating,
            reviews: item.reviews,
            link: item.link,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setWishlistItems((prev) => [data.item, ...prev])
          return { success: true, message: "Item added to wishlist" }
        } else {
          const errorData = await response.json()
          console.error("Failed to add to server wishlist:", errorData)
          throw new Error(errorData.error || "Failed to add to server wishlist")
        }
      } else {
        // Add to localStorage for guest users
        const newItem: WishlistItem = {
          id: Date.now(),
          user_id: "",
          product_id: productId,
          name: item.name,
          category: item.category,
          price: item.price,
          image: item.image,
          description: item.description,
          rating: item.rating,
          reviews: item.reviews,
          link: item.link,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const updatedWishlist = [newItem, ...wishlistItems]
        setWishlistItems(updatedWishlist)
        saveWishlistToStorage(updatedWishlist)
        return { success: true, message: "Item added to wishlist" }
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      return { success: false, error: "Failed to add item to wishlist" }
    }
  }

  // Remove item from wishlist
  const removeFromWishlist = async (itemId: number | string) => {
    try {
      if (user && session) {
        // Remove from server for authenticated users
        const response = await fetch(`/api/wishlist/${itemId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (response.ok) {
          setWishlistItems((prev) =>
            prev.filter((item) => item.id.toString() !== itemId.toString() && item.product_id !== itemId.toString()),
          )
          return { success: true }
        } else {
          const errorData = await response.json()
          console.error("Failed to remove from server wishlist:", errorData)
          throw new Error(errorData.error || "Failed to remove from server wishlist")
        }
      } else {
        // Remove from localStorage for guest users
        const updatedWishlist = wishlistItems.filter(
          (item) => item.id.toString() !== itemId.toString() && item.product_id !== itemId.toString(),
        )
        setWishlistItems(updatedWishlist)
        saveWishlistToStorage(updatedWishlist)
        return { success: true }
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      return { success: false, error: "Failed to remove item from wishlist" }
    }
  }

  // Clear entire wishlist
  const clearWishlist = async () => {
    try {
      if (user && session) {
        // Clear server wishlist for authenticated users
        const response = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (response.ok) {
          setWishlistItems([])
          return { success: true }
        } else {
          const errorData = await response.json()
          console.error("Failed to clear server wishlist:", errorData)
          throw new Error(errorData.error || "Failed to clear server wishlist")
        }
      } else {
        // Clear localStorage for guest users
        setWishlistItems([])
        if (typeof window !== "undefined") {
          localStorage.removeItem("wishlist_items")
        }
        return { success: true }
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error)
      return { success: false, error: "Failed to clear wishlist" }
    }
  }

  // Add pending wishlist item (for post-login processing)
  const addPendingWishlistItem = useCallback(async () => {
    try {
      if (typeof window !== "undefined") {
        const pendingItem = localStorage.getItem("pending_wishlist_item")
        if (pendingItem) {
          const item = JSON.parse(pendingItem)
          const result = await addToWishlist(item)
          if (result.success) {
            localStorage.removeItem("pending_wishlist_item")
            console.log("Added pending wishlist item after login")
          }
        }
      }
    } catch (error) {
      console.error("Error adding pending wishlist item:", error)
    }
  }, [])

  // Store item for later addition (when user logs in)
  const storePendingWishlistItem = useCallback(
    (item: {
      id?: number | string
      product_id?: string
      name: string
      category: string
      price: number
      image: string
      description?: string
      rating?: number
      reviews?: number
      link?: string
    }) => {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("pending_wishlist_item", JSON.stringify(item))
        }
      } catch (error) {
        console.error("Error storing pending wishlist item:", error)
      }
    },
    [],
  )

  // Check if item is in wishlist
  const isInWishlist = useCallback(
    (productId: number | string) => {
      return wishlistItems.some((item) => item.product_id === productId.toString())
    },
    [wishlistItems],
  )

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    addPendingWishlistItem,
    storePendingWishlistItem,
    isInWishlist,
    refreshWishlist: user ? loadWishlistFromServer : loadWishlistFromStorage,
    isAuthenticated: !!user,
  }
}
