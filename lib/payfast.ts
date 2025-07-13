import crypto from "crypto"

// ---------------------------------------------------------------------------
// Environment variables (recommended to be set in Vercel → Project Settings)
// ---------------------------------------------------------------------------
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || "10040412"
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || "hplfynw1fkm14"
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "This1is2Elite3Gowns45678"
export const PAYFAST_URL = process.env.PAYFAST_SANDBOX_URL || "https://sandbox.payfast.co.za/eng/process"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface PayFastFormData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  m_payment_id: string // Our internal order ID
  amount: string // "123.45"
  item_name: string
  // --- optional fields ------------------------------------------------------
  name_first?: string
  name_last?: string
  email_address?: string
  item_description?: string
  custom_str1?: string
  custom_str2?: string
  custom_str3?: string
  custom_str4?: string
  custom_str5?: string
  signature: string // added after signing
}

// ---------------------------------------------------------------------------
// Signature helpers
// ---------------------------------------------------------------------------
export function generatePayFastSignature(data: Record<string, string>): string {
  const query = Object.keys(data)
    .filter((k) => k !== "signature" && data[k] !== undefined && data[k] !== "")
    .sort()
    .map((k) => `${k}=${encodeURIComponent(data[k]).replace(/%20/g, "+")}`)
    .join("&")

  const stringToHash = PAYFAST_PASSPHRASE
    ? `${query}&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE).replace(/%20/g, "+")}`
    : query

  return crypto.createHash("md5").update(stringToHash).digest("hex")
}

export function verifyPayFastSignature(data: Record<string, string>): boolean {
  const { signature: received, ...rest } = data
  const expected = generatePayFastSignature(rest as Record<string, string>)
  return expected === received
}

// ---------------------------------------------------------------------------
// Checkout helpers
// ---------------------------------------------------------------------------
export function getPayFastCheckoutForm(params: {
  orderId: string
  totalAmountInCents: number
  itemName: string
  customerEmail: string
  siteUrl: string
  firstName?: string
  lastName?: string
}) {
  const { orderId, totalAmountInCents, itemName, customerEmail, siteUrl, firstName = "", lastName = "" } = params

  const amountZar = (totalAmountInCents / 100).toFixed(2) // "123.45"

  const base: Omit<PayFastFormData, "signature"> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: `${siteUrl}/payfast/return`,
    cancel_url: `${siteUrl}/payfast/cancel`,
    notify_url: `${siteUrl}/api/payfast/notify`,
    m_payment_id: orderId,
    amount: amountZar,
    item_name: itemName,
    email_address: customerEmail,
    name_first: firstName,
    name_last: lastName,
    custom_str1: orderId,
  }

  const fields: PayFastFormData = {
    ...base,
    signature: generatePayFastSignature(base as Record<string, string>),
  }

  return { url: PAYFAST_URL, fields }
}

/**
 * Alias kept for backward-compatibility with earlier imports.
 * Returns ONLY the form fields object, not the PayFast URL.
 */
export function getPayFastFormFields(params: Parameters<typeof getPayFastCheckoutForm>[0]): PayFastFormData {
  return getPayFastCheckoutForm(params).fields
}
