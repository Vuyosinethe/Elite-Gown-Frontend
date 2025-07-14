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
 * Generates the PayFast signature for the given data, following PayFast's specific ordering and encoding rules.
 * @param data The data object to sign.
 * @param orderedKeys An array of keys in the exact order required by PayFast for signature generation.
 * @returns The MD5 hash signature.
 */
function generatePayFastSignature(data: Record<string, string | number>, orderedKeys: string[]): string {
  let dataString = ""

  for (const key of orderedKeys) {
    const value = data[key]
    // Only include non-blank variables
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      // Encode values, replace spaces with '+'
      // Ensure URL encoding is uppercase (encodeURIComponent does this by default for hex)
      dataString += `${key}=${encodeURIComponent(String(value)).replace(/%20/g, "+")}&`
    }
  }

  // Remove trailing '&'
  dataString = dataString.slice(0, -1)

  // Add passphrase to the end
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

  // Define fields in the exact order required by PayFast for signature generation
  // This order is inferred from common PayFast integration examples and the structure of the form.
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
    custom_str1: userId || "", // Ensure it's an empty string if userId is falsy
    custom_str2: orderId || "", // Ensure it's an empty string if orderId is falsy
    // Add other custom fields as needed
  }

  // Explicitly define the order of keys for signature generation
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
  ]

  const signature = generatePayFastSignature(fields, orderedKeysForSignature)

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

  // For ITN verification, PayFast typically uses alphabetical sorting for the data string
  // unless specified otherwise for ITN. Sticking to alphabetical for ITN as it's common.
  const sortedKeys = Object.keys(dataWithoutSignature).sort()
  const generatedSignature = generatePayFastSignature(dataWithoutSignature, sortedKeys)

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
