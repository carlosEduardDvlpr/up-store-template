import CryptoJS from 'crypto-js'

// Define a secret key (keep this safe and obfuscated if possible)
const secretKey = process.env.SECRET_KEY ?? 'my-secret-key'

// Function to encrypt data
export const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString()
}

// Function to decrypt data
export const decryptData = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey)
  return bytes.toString(CryptoJS.enc.Utf8)
}
