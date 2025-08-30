"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MobileMenuProps {
  onClose: () => void
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const [isSaleOpen, setIsSaleOpen] = useState(false)

  return (
    <div className="flex flex-col space-y-4 p-4">
      <Link href="/" className="text-lg font-medium hover:text-foreground/80" onClick={onClose}>
        Home
      </Link>

      <div>
        <Button
          variant="ghost"
          className="w-full justify-between p-0 text-lg font-medium hover:text-green-600"
          onClick={() => setIsSaleOpen(!isSaleOpen)}
        >
          Sale
          <ChevronDown className={`h-4 w-4 transition-transform ${isSaleOpen ? "rotate-180" : ""}`} />
        </Button>

        {isSaleOpen && (
          <div className="mt-2 ml-4 space-y-2 max-h-60 overflow-y-auto">
            <Link href="/graduation-gowns" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
              Graduation Gowns
            </Link>
            <Link href="/medical-scrubs" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
              Medical Scrubs
            </Link>
            <Link href="/embroidered-merchandise" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
              Embroidered Merchandise
            </Link>
            <Link href="/products?category=caps" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
              Graduation Caps
            </Link>
            <Link
              href="/products?category=accessories"
              className="block py-2 text-sm hover:text-green-600"
              onClick={onClose}
            >
              Academic Accessories
            </Link>
            <Link
              href="/products?category=stoles"
              className="block py-2 text-sm hover:text-green-600"
              onClick={onClose}
            >
              Honor Stoles
            </Link>
            <Link
              href="/products?category=tassels"
              className="block py-2 text-sm hover:text-green-600"
              onClick={onClose}
            >
              Graduation Tassels
            </Link>
            <Link href="/products?category=hoods" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
              Academic Hoods
            </Link>
            <Link
              href="/products?category=lab-coats"
              className="block py-2 text-sm hover:text-green-600"
              onClick={onClose}
            >
              Lab Coats
            </Link>
            <Link
              href="/products?category=nursing"
              className="block py-2 text-sm hover:text-green-600"
              onClick={onClose}
            >
              Nursing Uniforms
            </Link>
            <Link
              href="/products?category=surgical"
              className="block py-2 text-sm hover:text-green-600"
              onClick={onClose}
            >
              Surgical Scrubs
            </Link>
            <Link
              href="/products?category=pediatric"
              className="block py-2 text-sm hover:text-green-600"
              onClick={onClose}
            >
              Pediatric Scrubs
            </Link>
            <Link
              href="/products?category=maternity"
              className="block py-2 text-sm hover:text-green-600"
              onClick={onClose}
            >
              Maternity Scrubs
            </Link>
            <Link href="/products?category=shoes" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
              Medical Shoes
            </Link>
            <Link href="/products?category=bags" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
              Medical Bags
            </Link>
          </div>
        )}
      </div>

      <Link href="/about" className="text-lg font-medium hover:text-foreground/80" onClick={onClose}>
        About
      </Link>

      <Link href="/contact" className="text-lg font-medium hover:text-foreground/80" onClick={onClose}>
        Contact
      </Link>
    </div>
  )
}
