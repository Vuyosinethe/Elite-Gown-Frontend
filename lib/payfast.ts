import crypto from "crypto"

// ---------------------------------------------------------------------------
// Environment variables (recommended to be set in Vercel → Project Settings)
// ---------------------------------------------------------------------------
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || "10040412"
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || "hplfynw1fkm14"
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "This1is2Elite3Gowns45678"
const PAYFAST_SANDBOX_URL = process.env.PAYFAST_SANDBOX_URL || "https://sandbox.payfast.co.za/eng/process"

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
 * Generates the signature for PayFast.
 * @param data The data object to sign.
 * @returns The generated signature.
 */
export function generatePayFastSignature(data: Record<string, string | number>): string {
  // Sort the data by key
  const sortedKeys = Object.keys(data).sort()
  const queryString = sortedKeys
    .map((key) => {
      const value = data[key]
      // Encode values, replace spaces with '+'
      return `${key}=${encodeURIComponent(String(value)).replace(/%20/g, "+")}`
    })
    .join("&")

  const passPhraseString = PAYFAST_PASSPHRASE
    ? `&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE).replace(/%20/g, "+")}`
    : ""
  const fullString = `${queryString}${passPhraseString}`

  return crypto.md5(fullString).toString()
}

/**
 * Verifies the signature from PayFast ITN.
 * @param data The data received from PayFast.
 * @param signature The signature to verify.
 * @returns True if the signature is valid, false otherwise.
 */
export function verifyPayFastSignature(data: Record<string, string | number>, signature: string): boolean {
  const generatedSignature = generatePayFastSignature(data)
  return generatedSignature === signature
}

// ---------------------------------------------------------------------------
// Checkout helpers
// ---------------------------------------------------------------------------
/**
 * Generates the form fields for PayFast checkout.
 * @param orderId The unique ID of the order.
 * @param amount The total amount of the order.
 * @param itemName The name of the item being purchased.
 * @param userEmail The user's email address.
 * @param returnUrl URL for successful payment.
 * @param cancelUrl URL for cancelled payment.
 * @param notifyUrl URL for ITN callback.
 * @returns An object containing the PayFast URL and form fields.
 */
export function getPayFastCheckoutForm({
  orderId,
  amount,
  itemName,
  userEmail,
  returnUrl,
  cancelUrl,
  notifyUrl,
}: {
  orderId: string
  amount: number
  itemName: string
  userEmail: string
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
}): PayFastCheckoutForm {
  const data: Record<string, string | number> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    m_payment_id: orderId, // Our unique order ID
    amount: amount.toFixed(2),
    item_name: itemName,
    email_address: userEmail,
    // Add other optional fields as needed, e.g., first_name, last_name, phone
  }

  const signature = generatePayFastSignature(data)
  data.signature = signature

  const fields: PayFastFormField[] = Object.keys(data).map((key) => ({
    name: key,
    value: String(data[key]),
  }))

  return {
    url: PAYFAST_SANDBOX_URL,
    fields,
  }
}

/**
 * Helper to get just the form fields for client-side rendering.
 * This is a named export to match the import in process/route.ts
 */
export function getPayFastFormFields({
  orderId,
  amount,
  itemName,
  userEmail,
  returnUrl,
  cancelUrl,
  notifyUrl,
}: {
  orderId: string
  amount: number
  itemName: string
  userEmail: string
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
}): PayFastFormField[] {
  const { fields } = getPayFastCheckoutForm({
    orderId,
    amount,
    itemName,
    userEmail,
    returnUrl,
    cancelUrl,
    notifyUrl,
  })
  return fields
}
