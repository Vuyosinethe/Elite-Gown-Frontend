"use client"

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"

// --- Cart React Context (shared across the whole app) ------------------------
const CartContext = createContext<ReturnType<typeof useCart> | null>(null)

/** Provider: wrap any part of the tree that needs cart access. */
export function CartProvider({ children }: { children: ReactNode }) {
  // Every provider instance re-uses the same hook logic.
  const cart = useCart()
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

/** Hook for consuming the shared cart instance created by `<CartProvider>` */
export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCartContext must be used within a <CartProvider>")
  }
  return ctx
}

interface CartItem {
  id: number
  product_id: number
  product_name: string
  product_details: string
  product_image: string
  price: number
  quantity: number
  user_id?: string
  session_id?: string
  created_at: string
  updated_at: string
}

// Generate a session ID for guest users
function generateSessionId(): string {
  return "session_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

export function useCart() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")

  // Initialize session ID for guest users
  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedSessionId = localStorage.getItem("cart_session_id")
      if (!storedSessionId) {
        storedSessionId = generateSessionId()
        localStorage.setItem("cart_session_id", storedSessionId)
      }
      setSessionId(storedSessionId)
    }
  }, [])

  // Fetch cart items from database
  const fetchCartItems = useCallback(async () => {
    if (!user && !sessionId) return

    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (!user && sessionId) {
        params.append("sessionId", sessionId)
      }

      const headers: HeadersInit = {}
      if (user) {
        // Get the session token for authenticated requests
        const {
          data: { session },
        } = await (await import("@/lib/supabase")).supabase.auth.getSession()
        if (session?.access_token) {
          headers.authorization = `Bearer ${session.access_token}`
        }
      }

      const response = await fetch(`/api/cart?${params.toString()}`, { headers })
      const data = await response.json()

      if (response.ok) {
        setCartItems(data.items || [])
      } else {
        console.error("Error fetching cart items:", data.error)
      }
    } catch (error) {
      console.error("Error fetching cart items:", error)
    } finally {
      setLoading(false)
    }
  }, [user, sessionId])

  // Load cart items when user or sessionId changes
  useEffect(() => {
    fetchCartItems()
  }, [fetchCartItems])

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
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (user) {
        const {
          data: { session },
        } = await (await import("@/lib/supabase")).supabase.auth.getSession()
        if (session?.access_token) {
          headers.authorization = `Bearer ${session.access_token}`
        }
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers,
        body: JSON.stringify({
          productId: item.id,
          productName: item.name,
          productDetails: item.details,
          productImage: item.image,
          price: item.price,
          quantity: item.quantity || 1,
          sessionId: !user ? sessionId : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        await fetchCartItems() // Refresh cart items
        return { success: true }
      } else {
        console.error("Error adding to cart:", data.error)
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      return { success: false, error: "Failed to add item to cart" }
    }
  }

  // Update item quantity
  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      return removeFromCart(itemId)
    }

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (user) {
        const {
          data: { session },
        } = await (await import("@/lib/supabase")).supabase.auth.getSession()
        if (session?.access_token) {
          headers.authorization = `Bearer ${session.access_token}`
        }
      }

      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ quantity: newQuantity }),
      })

      // --- NEW: robust JSON handling ---
      const contentType = response.headers.get("content-type") ?? ""
      let data: any = null
      if (contentType.includes("application/json")) {
        try {
          data = await response.json()
        } catch {
          /* malformed JSON – leave data as null */
        }
      }

      if (response.ok) {
        await fetchCartItems() // Refresh cart items
        return { success: true }
      } else {
        console.error("Error updating quantity:", data?.error || response.statusText)
        return { success: false, error: data?.error || "Unexpected response format" }
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      return { success: false, error: "Failed to update quantity" }
    }
  }

  // Remove item from cart
  const removeFromCart = async (itemId: number) => {
    try {
      const headers: HeadersInit = {}

      if (user) {
        const {
          data: { session },
        } = await (await import("@/lib/supabase")).supabase.auth.getSession()
        if (session?.access_token) {
          headers.authorization = `Bearer ${session.access_token}`
        }
      }

      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers,
      })

      const data = await response.json()

      if (response.ok) {
        await fetchCartItems() // Refresh cart items
        return { success: true }
      } else {
        console.error("Error removing from cart:", data.error)
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      return { success: false, error: "Failed to remove item from cart" }
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    try {
      const params = new URLSearchParams()
      if (!user && sessionId) {
        params.append("sessionId", sessionId)
      }

      const headers: HeadersInit = {}

      if (user) {
        const {
          data: { session },
        } = await (await import("@/lib/supabase")).supabase.auth.getSession()
        if (session?.access_token) {
          headers.authorization = `Bearer ${session.access_token}`
        }
      }

      const response = await fetch(`/api/cart?${params.toString()}`, {
        method: "DELETE",
        headers,
      })

      const data = await response.json()

      if (response.ok) {
        setCartItems([])
        return { success: true }
      } else {
        console.error("Error clearing cart:", data.error)
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
      return { success: false, error: "Failed to clear cart" }
    }
  }

  // Calculate totals
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vat = subtotal * 0.15
  const total = subtotal + vat

  /* -------------------------------------------------------------------------- */
  /*                              Cart Context API                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Create a React Context so components can access cart state without
   * prop-drilling.  This is OPTIONAL for callers that already use the `useCart`
   * hook directly, but some pages import a `CartProvider`, so we export it here
   * to keep backward compatibility and fix the runtime error.
   */

  type CartContextValue = ReturnType<typeof useCart>

  /**
   * Internal context to share a single cart instance across the tree.
   * It’s initialised to `null`; consumers must be nested inside <CartProvider>.
   */
  const CartContext = createContext<CartContextValue | null>(null)

  /**
   * CartProvider – wrap any part of the tree that needs cart access.
   *
   * \`\`\`tsx
   * <CartProvider>
   *   <YourApp />
   * </CartProvider>
   * \`\`\`
   */
  function CartProvider({ children }: { children: ReactNode }) {
    const cart = useCart()
    return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
  }

  /**
   * useCartContext – consume the shared cart instance created by <CartProvider>.
   * Throws if used outside the provider.
   */
  function useCartContext(): CartContextValue {
    const ctx = useContext(CartContext)
    if (!ctx) {
      throw new Error("useCartContext must be used within a <CartProvider>")
    }
    return ctx
  }

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
    refreshCart: fetchCartItems,
    isAuthenticated: !!user,
  }
}
