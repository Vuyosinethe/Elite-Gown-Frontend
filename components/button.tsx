"use client"

/**
 * Shim that re-exports the shadcn/ui Button with both
 * a **default** export and the original named exports.
 *
 * Some earlier components import `Button` like:
 *   import Button from '@/components/button'
 * which requires a default export.
 * The original file at `components/ui/button.tsx` only
 * provides a **named** `Button`, so at build time Vite/Next
 * reported:
 *   “The components/button.tsx module is missing the export Button as a default export”.
 *
 * Keeping this thin wrapper lets us satisfy those imports
 * without touching the generated shadcn file.
 */

import { Button as ShadButton, buttonVariants } from "@/components/ui/button"

export const Button = ShadButton // ↩ named export (unchanged)

// Provide the default export many files expect.
export default ShadButton

// Re-export the variants helper so callers that rely on it
// via `@/components/button` continue to work.
export { buttonVariants }
