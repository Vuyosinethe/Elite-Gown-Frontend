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

/**
 * Generates the PayFast signature for a given set of data.
 * The data must be sorted alphabetically by key.
 * @param data The data object to sign.
 * @returns The generated SHA256 signature.
 */
function generateSignature(data: Record<string, string | number>): string {
  // Sort keys alphabetically
  const sortedKeys = Object.keys(data).sort()

  // Create the query string
  const queryString = sortedKeys
    .map((key) => {
      const value = data[key]
      // Encode values, replace spaces with '+'
      return `${key}=${encodeURIComponent(String(value)).replace(/%20/g, "+")}`
    })
    .join("&")

  // Add passphrase if it exists
  const dataToHash = PAYFAST_PASSPHRASE ? `${queryString}&passphrase=${PAYFAST_PASSPHRASE}` : queryString

  // Generate SHA256 hash
  return crypto.createHash("md5").update(dataToHash).digest("hex")
}

/**
 * Verifies a PayFast signature against provided data.
 * @param data The data received from PayFast.
 * @param signature The signature to verify.
 * @returns True if the signature is valid, false otherwise.
 */
export function verifySignature(data: Record<string, string | number>, signature: string): boolean {
  const generatedSignature = generateSignature(data)
  return generatedSignature === signature
}

/**
 * Prepares the form fields for PayFast checkout.
 * @param orderId Your internal order ID.
 * @param amount The total amount to be paid.
 * @param itemName The name of the item/order.
 * @param userEmail The user's email address.
 * @param returnUrl URL for successful payment.
 * @param cancelUrl URL for cancelled payment.
 * @param notifyUrl URL for ITN (Instant Transaction Notification).
 * @returns An object containing the PayFast URL and an array of form fields.
 */
export function getPayFastCheckoutForm(
  orderId: string,
  amount: number,
  itemName: string,
  userEmail: string,
  returnUrl: string,
  cancelUrl: string,
  notifyUrl: string,
): PayFastCheckoutForm {
  const data: Record<string, string | number> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    name_first: "", // Optional: Customer's first name
    name_last: "", // Optional: Customer's last name
    email_address: userEmail,
    m_payment_id: orderId, // Your custom payment ID (order ID)
    amount: amount.toFixed(2), // Amount must be a string with 2 decimal places
    item_name: itemName,
    item_description: `Order ${orderId} from Elite Gowns`,
    // Optional fields
    custom_str1: "",
    custom_str2: "",
    custom_str3: "",
    custom_str4: "",
    custom_str5: "",
    custom_int1: "",
    custom_int2: "",
    custom_int3: "",
    custom_int4: "",
    custom_int5: "",
    email_confirmation: "1", // Send email confirmation to customer
    confirmation_address: userEmail, // Email address for confirmation
    payment_method: "", // Leave empty for all available payment methods
  }

  const signature = generateSignature(data)

  const formFields: PayFastFormField[] = Object.keys(data).map((key) => ({
    name: key,
    value: String(data[key]),
  }))

  formFields.push({ name: "signature", value: signature })

  return {
    url: PAYFAST_SANDBOX_URL,
    fields: formFields,
  }
}

/**
 * Helper to get just the form fields for direct use in a form.
 * @param orderId Your internal order ID.
 * @param amount The total amount to be paid.
 * @param itemName The name of the item/order.
 * @param userEmail The user's email address.
 * @param returnUrl URL for successful payment.
 * @param cancelUrl URL for cancelled payment.
 * @param notifyUrl URL for ITN (Instant Transaction Notification).
 * @returns An array of form fields.
 */
export function getPayFastFormFields(
  orderId: string,
  amount: number,
  itemName: string,
  userEmail: string,
  returnUrl: string,
  cancelUrl: string,
  notifyUrl: string,
): PayFastFormField[] {
  const { fields } = getPayFastCheckoutForm(orderId, amount, itemName, userEmail, returnUrl, cancelUrl, notifyUrl)
  return fields
}
