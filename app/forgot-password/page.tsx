"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/layout"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      setMessage(data.message ?? data.error ?? "Something went wrong")
    } catch (err) {
      console.error(err)
      setMessage("Unexpected error, please try again.")
    }
  }

  return (
    <Layout>
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <section className="w-full max-w-md rounded bg-white p-8 shadow">
          <h1 className="mb-6 text-center text-2xl font-bold">Forgot Password</h1>

          {message && (
            <p className="mb-4 text-center text-sm text-blue-600" role="alert">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mb-6 w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none"
            >
              Send Reset Link
            </button>
          </form>
        </section>
      </main>
    </Layout>
  )
}
