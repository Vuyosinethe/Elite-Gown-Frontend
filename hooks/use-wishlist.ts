"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export interface WishlistItem {
  id?: number
  user_id?: string
  product_id?: string
  product_name?: string
  product_price?: number
  product_image?: string
  name: string
  description: string
  price: number
  image: string
  category: string
  link: string
  rating: number
  reviews: number
  created_at?: string
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  const getAuthToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token
  }

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const token = await getAuthToken()

      if (!token) {
        console.log("No auth token available")
        setWishlistItems([])
        return
      }

      const response = await fetch("/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
      }

      const data = await response.json()
      // Extract items array from response
      setWishlistItems(Array.isArray(data.items) ? data.items : [])
    } catch (error) {
      console.error("Failed to load wishlist:", error)
      setWishlistItems([])
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (item: any) => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push("/login")
      return false
    }

    try {
      const token = await getAuthToken()

      if (!token) {
        router.push("/login")
        return false
      }

      // Prepare the item data for the API
      const wishlistData = {
        product_id: item.id?.toString() || item.product_id?.toString() || Math.random().toString(),
        product_name: item.name || item.product_name || "Unnamed Product",
        product_price: item.price || item.product_price || 0,
        product_image: item.image || item.product_image || "/placeholder.svg",
        name: item.name || item.product_name || "Unnamed Product",
        description: item.description || "No description available",
        price: item.price || item.product_price || 0,
        image: item.image || item.product_image || "/placeholder.svg",
        category: item.category || "Uncategorized",
        link: item.link || "#",
        rating: item.rating || 0,
        reviews: item.reviews || 0,
      }

      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(wishlistData),
      })

      if (!response.ok) {
        throw new Error("Failed to add to wishlist")
      }

      await fetchWishlist() // Refresh the list
      return true
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
      return false
    }
  }

  const removeFromWishlist = async (itemId: number | string) => {
    if (!user) {
      return false
    }

    try {
      const token = await getAuthToken()

      if (!token) {
        return false
      }

      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist")
      }

      await fetchWishlist() // Refresh the list
      return true
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
      return false
    }
  }

  // Check if an item is already in the wishlist
  const isInWishlist = (productId: string | number) => {
    return wishlistItems.some(
      (item) =>
        item.id?.toString() === productId?.toString() ||
        item.product_id?.toString() === productId?.toString() ||
        item.name === productId,
    )
  }

  const clearWishlist = async () => {
    if (!user) {
      return false
    }

    try {
      const token = await getAuthToken()

      if (!token) {
        return false
      }

      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to clear wishlist")
      }

      setWishlistItems([])
      return true
    } catch (error) {
      console.error("Failed to clear wishlist:", error)
      return false
    }
  }

  const refreshWishlist = async () => {
    await fetchWishlist()
  }

  // Add pending wishlist item after login
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

  useEffect(() => {
    fetchWishlist()
  }, [user])

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    refreshWishlist,
    isInWishlist,
    addPendingWishlistItem,
  }
}
