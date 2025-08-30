"use client"

import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [showSaleDropdown, setShowSaleDropdown] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Menu */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <Link href="/" onClick={onClose} className="block py-2 text-gray-700 hover:text-black">
            Home
          </Link>

          <div>
            <button
              onClick={() => setShowSaleDropdown(!showSaleDropdown)}
              className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-green-600"
            >
              <span>Sale</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showSaleDropdown ? "rotate-180" : ""}`} />
            </button>
            {showSaleDropdown && (
              <div className="pl-4 mt-2 space-y-2 max-h-60 overflow-y-auto">
                <Link
                  href="/graduation-gowns"
                  onClick={onClose}
                  className="block py-1 text-sm text-gray-600 hover:text-green-600"
                >
                  Graduation Gowns
                </Link>
                <Link
                  href="/medical-scrubs"
                  onClick={onClose}
                  className="block py-1 text-sm text-gray-600 hover:text-green-600"
                >
                  Medical Scrubs
                </Link>
                <Link
                  href="/embroidered-merchandise"
                  onClick={onClose}
                  className="block py-1 text-sm text-gray-600 hover:text-green-600"
                >
                  Embroidered Merchandise
                </Link>
                <Link
                  href="/products?category=caps"
                  onClick={onClose}
                  className="block py-1 text-sm text-gray-600 hover:text-green-600"
                >
                  Graduation Caps
                </Link>
                <Link
                  href="/products?category=accessories"
                  onClick={onClose}
                  className="block py-1 text-sm text-gray-600 hover:text-green-600"
                >
                  Academic Accessories
                </Link>
                <Link
                  href="/products?category=lab-coats"
                  onClick={onClose}
                  className="block py-1 text-sm text-gray-600 hover:text-green-600"
                >
                  Lab Coats
                </Link>
                <Link
                  href="/products?category=nursing"
                  onClick={onClose}
                  className="block py-1 text-sm text-gray-600 hover:text-green-600"
                >
                  Nursing Uniforms
                </Link>
                <Link
                  href="/products?category=surgical"
                  onClick={onClose}
                  className="block py-1 text-sm text-gray-600 hover:text-green-600"
                >
                  Surgical Scrubs
                </Link>
              </div>
            )}
          </div>

          <Link href="/about" onClick={onClose} className="block py-2 text-gray-700 hover:text-black">
            About
          </Link>
          <Link href="/contact" onClick={onClose} className="block py-2 text-gray-700 hover:text-black">
            Contact
          </Link>
        </div>
      </div>
    </div>
  )
}
