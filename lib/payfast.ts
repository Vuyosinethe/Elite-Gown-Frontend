import crypto from "crypto"

interface PayFastItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
  image_url?: string
}

interface PayFastCheckoutOptions {
  orderId: string
  totalAmount: number
  userId: string
  cartItems: PayFastItem[]
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
}

// PayFast Sandbox Credentials (from environment variables)
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || ""
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || ""
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || ""
const PAYFAST_SANDBOX_URL = process.env.PAYFAST_SANDBOX_URL || "https://sandbox.payfast.co.za/eng/process"

// Your site's public URL (from environment variables)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

/**
 * Generates the PayFast signature (MD5 hash) for the given data.
 * The order of parameters is crucial for PayFast.
 * @param data The key-value pairs to sign.
 * @param passphrase The PayFast passphrase.
 * @param orderedKeys An array specifying the exact order of keys for signature generation.
 * @returns The MD5 signature.
 */
function generatePayFastSignature(
  data: Record<string, string | number | undefined>,
  passphrase: string,
  orderedKeys: string[],
): string {
  let dataString = ""
  for (const key of orderedKeys) {
    const value = data[key]
    // Only include non-blank variables
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      // URL encode the value, then encode spaces as '+' and convert to uppercase
      const encodedValue = encodeURIComponent(String(value).trim()).replace(/%20/g, "+")
      dataString += `${key}=${encodedValue}&`
    }
  }

  // Add the passphrase at the end
  dataString += `passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`

  // MD5 hash the string
  return crypto.createHash("md5").update(dataString).digest("hex")
}

/**
 * Verifies the incoming ITN signature from PayFast.
 * @param data The received ITN data.
 * @param signature The signature received from PayFast.
 * @param passphrase The PayFast passphrase.
 * @returns True if the signature is valid, false otherwise.
 */
export function verifyPayFastSignature(data: Record<string, string>, signature: string, passphrase: string): boolean {
  // For ITN verification, PayFast typically sends parameters alphabetically.
  // We need to reconstruct the string in alphabetical order, excluding the signature itself.
  const sortedKeys = Object.keys(data)
    .filter((key) => key !== "signature")
    .sort()

  let dataString = ""
  for (const key of sortedKeys) {
    const value = data[key]
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      const encodedValue = encodeURIComponent(String(value).trim()).replace(/%20/g, "+")
      dataString += `${key}=${encodedValue}&`
    }
  }
  dataString += `passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`

  const generatedSignature = crypto.createHash("md5").update(dataString).digest("hex")
  return generatedSignature === signature
}

/**
 * Verifies if the incoming request IP address is from PayFast.
 * In a real production environment, you would fetch the latest IP list from PayFast.
 * For sandbox, these are known IPs.
 * @param ip The IP address of the incoming request.
 * @returns True if the IP is a valid PayFast IP, false otherwise.
 */
export function verifyPayFastIp(ip: string): boolean {
  // These are example sandbox IPs. In production, fetch from PayFast API.
  const PAYFAST_IPS = ["196.46.20.10", "196.46.20.11", "196.46.20.12", "196.46.20.13"] // Example sandbox IPs
  return PAYFAST_IPS.includes(ip)
}

/**
 * Creates the form fields required for a PayFast payment.
 * @param totalAmount The total amount of the transaction in Rands.
 * @param orderId The unique ID of the order.
 * @param userId The ID of the user making the purchase.
 * @param items An array of cart items.
 * @returns An object containing all PayFast form fields, including the generated signature.
 */
export function createPayFastFormFields(
  totalAmount: number,
  orderId: string,
  userId: string,
  items: Array<{ product_id: string; product_name: string; quantity: number; price: number; product_image?: string }>,
): Record<string, string> {
  const merchantReference = `ORDER-${orderId}` // Unique reference for your system

  // PayFast requires item details to be passed as separate parameters
  // For simplicity, we'll just pass the total amount and a generic item name.
  // For this integration, we'll use a single item for the total.
  const itemNames = items.map((item) => `${item.product_name} (x${item.quantity})`).join(", ")
  const itemDescriptions = items
    .map((item) => `${item.product_name} (Qty: ${item.quantity}, Price: R${item.price.toFixed(2)})`)
    .join("; ")

  const data: Record<string, string | number | undefined> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: `${SITE_URL}/payfast/return`,
    cancel_url: `${SITE_URL}/payfast/cancel`,
    notify_url: `${SITE_URL}/api/payfast/notify`,
    name_first: "", // Optional, can be populated from user profile
    name_last: "", // Optional
    email_address: "", // Optional
    m_payment_id: merchantReference, // Your unique order ID
    amount: totalAmount.toFixed(2), // Total amount in Rands, 2 decimal places
    item_name: `EliteGowns Order ${merchantReference}`,
    item_description: `Purchase from EliteGowns: ${itemNames}`,
    custom_str1: userId || "", // Pass userId as custom string
    custom_str2: orderId || "", // Pass orderId as custom string
    // custom_str3, custom_str4, custom_str5 are also available
    // custom_int1 to custom_int5 are also available
    email_confirmation: "1", // Send email confirmation to buyer
    confirmation_address: "", // Optional: specific email for confirmation
    payment_method: "", // Optional: 'cc' for credit card, 'eft' for EFT etc.
  }

  // Define the exact order of fields for signature generation as per PayFast documentation
  // This order is crucial and must match PayFast's internal expectation.
  // This list should be as exhaustive as possible for all fields you might send.
  const orderedKeysForSignature = [
    "merchant_id",
    "merchant_key",
    "return_url",
    "cancel_url",
    "notify_url",
    "name_first",
    "name_last",
    "email_address",
    "m_payment_id",
    "amount",
    "item_name",
    "item_description",
    "custom_str1",
    "custom_str2",
    "custom_str3",
    "custom_str4",
    "custom_str5",
    "custom_int1",
    "custom_int2",
    "custom_int3",
    "custom_int4",
    "custom_int5",
    "email_confirmation",
    "confirmation_address",
    "payment_method",
  ]

  // Filter out undefined/null values and ensure empty strings for optional fields
  // This filteredData is what will be used to generate the signature.
  const filteredData: Record<string, string | number | undefined> = {}
  for (const key of orderedKeysForSignature) {
    const value = data[key]
    filteredData[key] = value !== undefined && value !== null ? value : ""
  }

  const signature = generatePayFastSignature(filteredData, PAYFAST_PASSPHRASE, orderedKeysForSignature)

  // The final form fields sent to PayFast should only include non-blank values
  const finalFormFields: Record<string, string> = {}
  for (const key in filteredData) {
    const value = filteredData[key]
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      finalFormFields[key] = String(value)
    }
  }
  finalFormFields.signature = signature

  return finalFormFields
}

export const PAYFAST_URL = PAYFAST_SANDBOX_URL
