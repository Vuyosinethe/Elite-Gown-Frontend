"use client"

import type { ReactNode } from "react"

/**
 * Lightweight wrapper so pages that import `@/components/layout`
 * compile without errors.  If you have a global header / footer
 * component, you can import and place them here.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// Provide a named export alongside the default export.
export { Layout }
