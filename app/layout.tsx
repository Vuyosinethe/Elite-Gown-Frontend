import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { CartDrawer } from "@/components/cart-drawer" // Ensure this is a named export or default export

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Elite Gowns",
  description: "Your one-stop shop for graduation gowns and medical scrubs.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <header className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
              <a className="flex items-center gap-2 font-semibold" href="#">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2 3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a2 2 0 0 1-4 0v-2a2 2 0 0 1 4 0v2Z" />
                </svg>
                <span>Elite Gowns</span>
              </a>
            </div>
            <nav className="hidden space-x-4 text-sm font-medium md:flex">
              <a className="hover:underline" href="/">
                Home
              </a>
              <a className="hover:underline" href="/graduation-gowns">
                Graduation Gowns
              </a>
              <a className="hover:underline" href="/medical-scrubs">
                Medical Scrubs
              </a>
              <a className="hover:underline" href="/rental">
                Rental
              </a>
              <a className="hover:underline" href="/embroidered-merchandise">
                Embroidered Merchandise
              </a>
              <a className="hover:underline" href="/size-guide">
                Size Guide
              </a>
              <a className="hover:underline" href="/faq">
                FAQ
              </a>
              <a className="hover:underline" href="/contact">
                Contact
              </a>
              <a className="hover:underline" href="/about">
                About
              </a>
              <a className="hover:underline" href="/returns">
                Returns
              </a>
              <a className="hover:underline" href="/shipping">
                Shipping
              </a>
              <a className="hover:underline" href="/account">
                Account
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <CartDrawer /> {/* CartDrawer component */}
            </div>
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
