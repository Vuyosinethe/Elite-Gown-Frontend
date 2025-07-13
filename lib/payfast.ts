import crypto from "crypto"

// It is highly recommended to store these as environment variables
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID!
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY!
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || ""
const PAYFAST_SANDBOX_URL = process.env.PAYFAST_SANDBOX_URL || "https://sandbox.payfast.co.za/eng/process"

interface PayFastFormData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first?: string
  name_last?: string
  email_address?: string
  m_payment_id: string // Our custom order ID
  amount: string
  item_name: string
  item_description?: string
  custom_str1?: string // Can be used for order ID or other metadata
  custom_str2?: string
  custom_str3?: string
  custom_str4?: string
  custom_str5?: string
  signature: string
  passphrase?: string // Only for signature generation, not sent in form
}

/**
 * Generates the PayFast signature for a given set of data.
 * The data must be sorted alphabetically by key, then URL-encoded, and joined by '&'.
 * The passphrase is included in the string to be hashed.
 * @param data The data object to sign.
 * @returns The MD5 signature.
 */
export function generatePayFastSignature(data: Record<string, string>): string {
  // Sort the data by key
  const sortedKeys = Object.keys(data).sort()
  const queryString = sortedKeys
    .map(key => {
      // Encode values, replace spaces with '+'
      const value = encodeURIComponent(data[key]).replace(/%20/g, '+')
      return `${key}=${value}`
    })
    .join('&')

  // Add passphrase if it exists
  const signatureString = PAYFAST_PASSPHRASE ? `${queryString}&passphrase=${PAYFAST_PASSPHRASE}` : queryString

  // Generate MD5 hash
  return crypto.createHash('md5').update(signatureString).digest('hex')
}

/**
 * Verifies the PayFast ITN signature.
 * @param data The ITN data received from PayFast.
 * @param signature The signature to verify against.
 * @returns True if the signature is valid, false otherwise.
 */
export function verifyPayFastSignature(data: Record<string, string>, signature: string): boolean {
  const generatedSignature = generatePayFastSignature(data)
  return generatedSignature === signature
}

/**
 * Prepares the form data for PayFast checkout.
 * @param orderId Our internal order ID.
 * @param totalAmountInCents Total amount in cents (e.g., 1000 for R10.00).
 * @param itemName Name of the item(s) being purchased.
 * @param customerEmail Customer's email address.
 * @param siteUrl The base URL of your site for return/cancel/notify URLs.
 * @param firstName Customer's first name.
 * @param lastName Customer's last name.
 * @returns An object containing the PayFast URL and the form fields.
 */
export function getPayFastCheckoutForm(
  orderId: string,
  totalAmountInCents: number,
  itemName: string,
  customerEmail: string,
  siteUrl: string,
  firstName = "",
  lastName = "",
) {
  const amount = (totalAmountInCents / 100).toFixed(2) // Convert cents to ZAR with 2 decimal places

  const formData: Record<string, string> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: `${siteUrl}/payfast/return`,
    cancel_url: `${siteUrl}/payfast/cancel`,
    notify_url: `${siteUrl}/api/payfast/notify`,
    name_first: firstName, // Placeholder, ideally from user profile
    name_last: lastName, // Placeholder
    email_address: customerEmail,
    m_payment_id: orderId, // Our unique order ID
    amount: amount,
    item_name: itemName,
    item_description: `Order ${orderId} from EliteGowns`,
    custom_str1: orderId, // Custom field to pass our order ID back
    // You can add more custom_str fields if needed
  }

  const signature = generatePayFastSignature(formData)

  return {
    url: PAYFAST_SANDBOX_URL,
    fields: {
      ...formData,
      signature: signature,
    },
  }
}

export const PAYFAST_URL = PAYFAST_SANDBOX_URL
