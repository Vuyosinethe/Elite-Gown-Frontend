export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  type?: string
  sale?: boolean
  sale_price?: number
  colors?: string[]
  sizes?: string[]
  material?: string
  whats_included?: string[]
  product_description?: string
  size_guide_url?: string
  is_rental?: boolean
  rental_price_per_day?: number
  rental_duration_days?: number
  badges?: string[]
}

export interface CartItem {
  id: string
  product_id: string
  name: string
  image: string
  price: number
  quantity: number
  total: number
  options?: {
    color?: string
    size?: string
    customization?: string
  }
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product_name: string
  product_image: string
  product_price: number
}

export interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string | null
  guest_id: string | null
  order_number: string
  total_amount: number
  status: string
  shipping_address: any
  billing_address: any
  payment_status: string
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  item_total: number
  metadata: any
  created_at: string
  updated_at: string
}

export interface CustomQuote {
  id: string
  user_id: string | null
  guest_id: string | null
  name: string
  email: string
  phone: string | null
  description: string
  status: string
  created_at: string
  updated_at: string
}

// Extend the User type from Supabase if needed, though Profile handles most custom data
declare module "@supabase/supabase-js" {
  interface User {
    // You can add custom properties here if they are directly attached to the auth.users table
    // For example, if you added a 'username' column directly to auth.users
    // username?: string;
  }
}
