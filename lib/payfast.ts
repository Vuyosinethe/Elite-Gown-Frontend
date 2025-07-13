import crypto from "crypto"

// ---------------------------------------------------------------------------
// Environment variables (recommended to be set in Vercel → Project Settings)
// ---------------------------------------------------------------------------
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || "10040412"
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || "hplfynw1fkm14"
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "This1is2Elite3Gowns45678"
const PAYFAST_SANDBOX_URL = process.env.PAYFAST_SANDBOX_URL || "https://sandbox.payfast.co.za/eng/process"
const PAYFAST_LIVE_URL = process.env.PAYFAST_LIVE_URL || "https://www.payfast.co.za/eng/process"
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PayFastFormField {
  name: string
  value: string
}

interface PayFastCheckoutForm {
  url: string
  fields: PayFastFormField[]
}

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
/**
 * Generates the PayFast signature for a given set of data.
 * @param data The data object to sign.
 * @param passphrase The passphrase for the merchant.
 * @returns The generated signature.
 */
function generateSignature(data: Record<string, string | number>, passphrase?: string): string {
  // Sort the data by key
  const sortedKeys = Object.keys(data).sort()
  let queryString = ""

  for (const key of sortedKeys) {
    const value = data[key]
    if (value !== undefined && value !== null && value !== "") {
      queryString += `${key}=${encodeURIComponent(String(value).trim()).replace(/%20/g, "+")}&`
    }
  }

  // Remove trailing '&'
  queryString = queryString.slice(0, -1)

  if (passphrase) {
    queryString += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
  }

  return crypto.md5(queryString).toString("hex")
}

/**
 * Verifies the PayFast signature.
 * @param data The data received from PayFast.
 * @param signature The signature to verify.
 * @param passphrase The passphrase for the merchant.
 * @returns True if the signature is valid, false otherwise.
 */
export function verifySignature(data: Record<string, string>, signature: string, passphrase?: string): boolean {
  const generated = generateSignature(data, passphrase)
  return generated === signature
}

// ---------------------------------------------------------------------------
// Checkout helpers
// ---------------------------------------------------------------------------
/**
 * Prepares the data for the PayFast checkout form.
 * @param orderId The internal order ID.
 * @param amount The total amount to be paid.
 * @param itemName The name of the item(s) being purchased.
 * @param userEmail The user's email address.
 * @returns An object containing the PayFast URL and form fields.
 */
export function getPayFastCheckoutForm(
  orderId: string,
  amount: number,
  itemName: string,
  userEmail: string,
): PayFastCheckoutForm {
  const data: Record<string, string | number> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: `${NEXT_PUBLIC_SITE_URL}/payfast/return?order_id=${orderId}`,
    cancel_url: `${NEXT_PUBLIC_SITE_URL}/payfast/cancel?order_id=${orderId}`,
    notify_url: `${NEXT_PUBLIC_SITE_URL}/api/payfast/notify`,
    m_payment_id: orderId, // Unique payment ID for your system
    amount: amount.toFixed(2),
    item_name: itemName,
    email_address: userEmail,
    // Add other optional fields as needed, e.g., name_first, name_last, email_address, cell_number
  }

  const signature = generateSignature(data, PAYFAST_PASSPHRASE)

  const formFields: PayFastFormField[] = Object.entries(data).map(([key, value]) => ({
    name: key,
    value: String(value),
  }))

  formFields.push({ name: "signature", value: signature })

  return {
    url: PAYFAST_SANDBOX_URL,
    fields: formFields,
  }
}

/**
 * Helper to get just the form fields for direct use in a form.
 * @param orderId The internal order ID.
 * @param amount The total amount to be paid.
 * @param itemName The name of the item(s) being purchased.
 * @param userEmail The user's email address.
 * @returns An array of form fields.
 */
export function getPayFastFormFields(
  orderId: string,
  amount: number,
  itemName: string,
  userEmail: string,
): PayFastFormField[] {
  const { fields } = getPayFastCheckoutForm(orderId, amount, itemName, userEmail)
  return fields
}
