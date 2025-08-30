"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
          <div className="space-y-2">
            <p className="font-semibold text-green-600">Sale</p>
            <div className="pl-4 space-y-2">
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
              <Link href="/rental" onClick={onClose} className="block py-1 text-sm text-gray-600 hover:text-green-600">
                Rental Services
              </Link>
              <Link
                href="/products"
                onClick={onClose}
                className="block py-1 text-sm text-gray-600 hover:text-green-600"
              >
                All Products
              </Link>
            </div>
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
