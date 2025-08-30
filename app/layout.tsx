"use client"

import type React from "react"

import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { CartDrawer } from "@/components/cart-drawer"
import { MobileMenu } from "@/components/mobile-menu"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart, Menu, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const inter = Inter({ subsets: ["latin"] })

function Header() {
  const { items, toggleCart } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-lg font-semibold hover:text-gray-600">
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-lg font-semibold hover:text-green-600 transition-colors">
                Sale
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                <DropdownMenuItem asChild>
                  <Link href="/graduation-gowns" className="hover:bg-green-50">
                    Graduation Gowns
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/medical-scrubs" className="hover:bg-green-50">
                    Medical Scrubs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/embroidered-merchandise" className="hover:bg-green-50">
                    Embroidered Merchandise
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products" className="hover:bg-green-50">
                    Academic Regalia
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products" className="hover:bg-green-50">
                    Ceremonial Wear
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products" className="hover:bg-green-50">
                    Professional Attire
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products" className="hover:bg-green-50">
                    Custom Embroidery
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products" className="hover:bg-green-50">
                    Accessories
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products" className="hover:bg-green-50">
                    Caps & Tassels
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products" className="hover:bg-green-50">
                    Stoles & Sashes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products" className="hover:bg-green-50">
                    Honor Cords
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products" className="hover:bg-green-50">
                    Medals & Awards
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/rental" className="hover:bg-green-50">
                    Rental Services
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about" className="text-lg font-semibold hover:text-gray-600">
              About
            </Link>
            <Link href="/contact" className="text-lg font-semibold hover:text-gray-600">
              Contact
            </Link>
          </nav>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center md:justify-start md:flex-initial">
            <Link href="/" className="flex items-center">
              <Image src="/elite-gowns-logo.png" alt="Elite Gowns" width={120} height={40} className="h-10 w-auto" />
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                <Heart className="h-6 w-6" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <User className="h-6 w-6" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <CartDrawer />
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
