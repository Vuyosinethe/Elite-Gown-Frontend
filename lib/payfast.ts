import crypto from "crypto"

// PayFast Sandbox Credentials (should ideally be environment variables)
const PAYFAST_MERCHANT_ID = "10040412"
const PAYFAST_MERCHANT_KEY = "hplfynw1fkm14"
const PAYFAST_PASSPHRASE = "This1is2Elite3Gowns45678"
const PAYFAST_SANDBOX_URL = "https://sandbox.payfast.co.za/eng/process"

interface PayFastFormData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first?: string
  name_last?: string
  email_address?: string
  m_payment_id?: string // Your unique order ID
  amount: string
  item_name: string
  item_description?: string
  custom_str1?: string // Can be used for order_id
  custom_str2?: string
  custom_str3?: string
  custom_str4?: string
  custom_str5?: string
  email_confirmation?: string
  confirmation_address?: string
  payment_method?: string
  // Add other fields as needed
}

/**
 * Generates the PayFast signature for a given set of data.
 * The signature is an MD5 hash of the data string, followed by an HMAC-SHA1 hash using the passphrase.
 * @param data The key-value pairs to sign.
 * @returns The generated signature.
 */
export function generatePayFastSignature(data: Record<string, string | number>): string {
  // 1. Sort the data by key
  const sortedKeys = Object.keys(data).sort()

  // 2. Concatenate key=value pairs, URL-encoding values and separating with '&'
  const dataString = sortedKeys
    .map((key) => {
      const value = data[key]
      // PayFast requires specific encoding for values
      return `${key}=${encodeURIComponent(String(value).replace(/%20/g, "+"))}`
    })
    .join("&")

  // 3. Append passphrase if it exists
  const dataToHash = PAYFAST_PASSPHRASE
    ? `${dataString}&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE.replace(/%20/g, "+"))}`
    : dataString

  // 4. MD5 hash
  const md5Hash = crypto.createHash("md5").update(dataToHash).digest("hex")

  // 5. HMAC-SHA1 hash using the merchant key
  const hmac = crypto.createHmac("sha1", PAYFAST_MERCHANT_KEY)
  hmac.update(md5Hash)
  const signature = hmac.digest("hex")

  return signature
}

/**
 * Verifies the PayFast ITN signature.
 * @param itnData The ITN data received from PayFast.
 * @returns True if the signature is valid, false otherwise.
 */
export function verifyPayFastSignature(itnData: Record<string, string>): boolean {
  const receivedSignature = itnData.signature
  if (!receivedSignature) {
    return false
  }

  // Remove the signature from the data before re-calculating
  const dataToVerify = { ...itnData }
  delete dataToVerify.signature

  // Convert all values to strings for consistent hashing
  const stringifiedData: Record<string, string | number> = {}
  for (const key in dataToVerify) {
    stringifiedData[key] = String(dataToVerify[key])
  }

  const calculatedSignature = generatePayFastSignature(stringifiedData)
  return calculatedSignature === receivedSignature
}

/**
 * Constructs the PayFast form data for a checkout.
 * @param orderId Your unique order ID.
 * @param amount The total amount in ZAR (e.g., "100.00").
 * @param itemName The name of the item.
 * @param userEmail The user's email address.
 * @param siteUrl The base URL of your application.
 * @returns An object containing all PayFast form fields, including the signature.
 */
export function getPayFastCheckoutForm(
  orderId: string,
  amount: number, // Amount in cents
  itemName: string,
  userEmail: string,
  siteUrl: string,
  firstName?: string,
  lastName?: string,
): { url: string; fields: Record<string, string> } {
  const returnUrl = `${siteUrl}/payfast/return`
  const cancelUrl = `${siteUrl}/payfast/cancel`
  const notifyUrl = `${siteUrl}/api/payfast/notify`

  const amountString = (amount / 100).toFixed(2) // Convert cents to ZAR string

  const fields: PayFastFormData = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    m_payment_id: orderId,
    amount: amountString,
    item_name: itemName,
    email_address: userEmail,
    name_first: firstName,
    name_last: lastName,
    custom_str1: orderId, // Store order_id in custom_str1 for easy retrieval in ITN
  }

  // Filter out undefined values before signing
  const filteredFields: Record<string, string | number> = {}
  for (const key in fields) {
    const value = fields[key as keyof PayFastFormData]
    if (value !== undefined && value !== null) {
      filteredFields[key] = value
    }
  }

  const signature = generatePayFastSignature(filteredFields)

  return {
    url: PAYFAST_SANDBOX_URL,
    fields: {
      ...filteredFields,
      signature,
    } as Record<string, string>, // Cast to string as all values will be strings for form submission
  }
}
