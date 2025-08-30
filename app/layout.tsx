"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { ShoppingCart, Menu, ChevronDown, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileMenu } from "@/components/mobile-menu"
import { CartDrawer } from "@/components/cart-drawer"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

const inter = Inter({ subsets: ["latin"] })

function Header() {
  const { items } = useCart()
  const { user } = useAuth()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/elite-gowns-logo.png" alt="Elite Gowns" width={40} height={40} className="rounded" />
            <span className="text-xl font-bold">Elite Gowns</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/products" className="hover:text-blue-600">
              Products
            </Link>
            <Link href="/graduation-gowns" className="hover:text-blue-600">
              Graduation Gowns
            </Link>
            <Link href="/medical-scrubs" className="hover:text-blue-600">
              Medical Scrubs
            </Link>
            <Link href="/embroidered-merchandise" className="hover:text-blue-600">
              Embroidered Merchandise
            </Link>
            <Link href="/rental" className="hover:text-blue-600">
              Rental
            </Link>

            {/* Sale Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 hover:text-blue-600">
                <span>Sale</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=graduation-gowns&sale=true">Graduation Gowns</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=medical-scrubs&sale=true">Medical Scrubs</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=nursing-uniforms&sale=true">Nursing Uniforms</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=lab-coats&sale=true">Lab Coats</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=surgical-scrubs&sale=true">Surgical Scrubs</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=dental-uniforms&sale=true">Dental Uniforms</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=veterinary-scrubs&sale=true">Veterinary Scrubs</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=embroidered-merchandise&sale=true">Embroidered Merchandise</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=accessories&sale=true">Accessories</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=footwear&sale=true">Medical Footwear</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=caps&sale=true">Medical Caps</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=masks&sale=true">Face Masks</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=stethoscopes&sale=true">Stethoscopes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=badges&sale=true">ID Badges</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-green-100">
                  <Link href="/products?category=bags&sale=true">Medical Bags</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about" className="hover:text-blue-600">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-600">
              Contact
            </Link>
          </nav>

          {/* Right side icons - moved to far right */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="sm">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <CartDrawer>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </CartDrawer>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <MobileMenu />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
