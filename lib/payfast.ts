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

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || "10040412"
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || "hplfynw1fkm14"
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "This1is2Elite3Gowns45678"
const PAYFAST_SANDBOX_URL = process.env.PAYFAST_SANDBOX_URL || "https://sandbox.payfast.co.za/eng/process"

/**
 * Generates the PayFast signature for the given data.
 * @param data The data object to sign.
 * @returns The MD5 hash signature.
 */
function generatePayFastSignature(data: Record<string, string | number>): string {
  // Sort the data by key
  const sortedKeys = Object.keys(data).sort()
  let dataString = ""

  for (const key of sortedKeys) {
    if (data[key] !== null && data[key] !== undefined) {
      dataString += `${key}=${encodeURIComponent(String(data[key]).trim()).replace(/%20/g, "+")}&`
    }
  }

  // Remove trailing '&'
  dataString = dataString.slice(0, -1)

  // Add passphrase if it exists
  if (PAYFAST_PASSPHRASE) {
    dataString = `${dataString}&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE).replace(/%20/g, "+")}`
  }

  return crypto.createHash("md5").update(dataString).digest("hex")
}

/**
 * Creates the necessary form fields for PayFast checkout.
 * @param options Checkout options including order details and URLs.
 * @returns An object containing the PayFast URL and the form fields.
 */
export function createPayFastFormFields({
  orderId,
  totalAmount,
  userId,
  cartItems,
  returnUrl,
  cancelUrl,
  notifyUrl,
}: PayFastCheckoutOptions) {
  const itemNames = cartItems.map((item) => item.product_name).join(", ")
  const itemDescriptions = cartItems
    .map((item) => `${item.quantity}x ${item.product_name} (R${item.price.toFixed(2)})`)
    .join("; ")

  const fields: Record<string, string | number> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    name_first: "Customer", // Placeholder, ideally from user profile
    name_last: "User", // Placeholder, ideally from user profile
    email_address: "customer@example.com", // Placeholder, ideally from user profile
    m_payment_id: orderId, // Your unique order ID
    amount: totalAmount.toFixed(2),
    item_name: itemNames.substring(0, 100), // Max 100 chars
    item_description: itemDescriptions.substring(0, 255), // Max 255 chars
    custom_str1: userId, // Custom field to pass user ID
    custom_str2: orderId, // Custom field to pass order ID
    // Add other custom fields as needed
  }

  const signature = generatePayFastSignature(fields)

  return {
    payfastUrl: PAYFAST_SANDBOX_URL,
    payfastFields: {
      ...fields,
      signature,
    },
  }
}

/**
 * Verifies the PayFast ITN (Instant Transaction Notification) signature.
 * @param data The ITN data received from PayFast.
 * @returns True if the signature is valid, false otherwise.
 */
export function verifyPayFastSignature(data: Record<string, string | number>): boolean {
  const receivedSignature = String(data.signature)
  const dataWithoutSignature = { ...data }
  delete dataWithoutSignature.signature // Remove signature before generating hash

  const generatedSignature = generatePayFastSignature(dataWithoutSignature)
  return receivedSignature === generatedSignature
}

/**
 * Verifies the PayFast ITN (Instant Transaction Notification) IP address.
 * @param ip The IP address of the incoming request.
 * @returns True if the IP is a valid PayFast IP, false otherwise.
 */
export function verifyPayFastIp(ip: string): boolean {
  const validPayFastIps = [
    "197.249.2.192",
    "197.249.2.193",
    "197.249.2.194",
    "197.249.2.195",
    "197.249.2.196",
    "197.249.2.197",
    "197.249.2.198",
    "197.249.2.199",
    "197.249.2.200",
    "197.249.2.201",
    "197.249.2.202",
    "197.249.2.203",
    "197.249.2.204",
    "197.249.2.205",
    "197.249.2.206",
    "197.249.2.207",
    "197.249.2.208",
    "197.249.2.209",
    "197.249.2.210",
    "197.249.2.211",
    "197.249.2.212",
    "197.249.2.213",
    "197.249.3.192",
    "197.249.3.193",
    "197.249.3.194",
    "197.249.3.195",
    "197.249.3.196",
    "197.249.3.197",
    "197.249.3.198",
    "197.249.3.199",
    "197.249.3.200",
    "197.249.3.201",
    "197.249.3.202",
    "197.249.3.203",
    "197.249.3.204",
    "197.249.3.205",
    "197.249.3.206",
    "197.249.3.207",
    "197.249.3.208",
    "197.249.3.209",
    "197.249.3.210",
    "197.249.3.211",
    "197.249.3.212",
    "197.249.3.213",
  ]
  return validPayFastIps.includes(ip)
}
