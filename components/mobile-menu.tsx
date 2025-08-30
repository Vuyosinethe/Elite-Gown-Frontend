"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-4">
          <Link href="/" className="block py-2 text-lg font-medium" onClick={onClose}>
            Home
          </Link>

          <div>
            <button
              onClick={() => toggleSection("shop")}
              className="flex items-center justify-between w-full py-2 text-lg font-medium"
            >
              Shop
              {expandedSection === "shop" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {expandedSection === "shop" && (
              <div className="pl-4 space-y-2 mt-2">
                <Link
                  href="/graduation-gowns"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Graduation Gowns
                </Link>
                <Link
                  href="/medical-scrubs"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Medical Scrubs
                </Link>
                <Link
                  href="/embroidered-merchandise"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Embroidered Merchandise
                </Link>
                <Link
                  href="/rental"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Rental Services
                </Link>
                <Link
                  href="/products"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  All Products
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection("sale")}
              className="flex items-center justify-between w-full py-2 text-lg font-medium"
            >
              Sale
              {expandedSection === "sale" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {expandedSection === "sale" && (
              <div className="pl-4 space-y-2 mt-2">
                <Link
                  href="/products?category=nursing-uniforms"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Nursing Uniforms
                </Link>
                <Link
                  href="/products?category=lab-coats"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Lab Coats
                </Link>
                <Link
                  href="/products?category=surgical-scrubs"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Surgical Scrubs
                </Link>
                <Link
                  href="/products?category=dental-uniforms"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Dental Uniforms
                </Link>
                <Link
                  href="/products?category=veterinary-scrubs"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Veterinary Scrubs
                </Link>
                <Link
                  href="/products?category=accessories"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Accessories
                </Link>
                <Link
                  href="/products?category=footwear"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Medical Footwear
                </Link>
                <Link
                  href="/products?category=caps"
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  Medical Caps
                </Link>
              </div>
            )}
          </div>

          <Link href="/about" className="block py-2 text-lg font-medium" onClick={onClose}>
            About
          </Link>

          <Link href="/contact" className="block py-2 text-lg font-medium" onClick={onClose}>
            Contact
          </Link>

          <Separator />

          <Link href="/login" className="block py-2 text-lg font-medium" onClick={onClose}>
            Sign In
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
