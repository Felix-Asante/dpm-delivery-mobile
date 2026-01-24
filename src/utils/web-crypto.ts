import { Logger } from "@/lib/logger";
import { ENV } from "./env";

// vector length
const IV_LENGTH = 12;
const KEY_LENGTH = 256;

const logger = new Logger("WebCryptoUtils");

const WEB_CRYPTO_KEY = ENV.webCryptoKey;

// Generate or retrieve a device-specific encryption key for web
// Stored in localStorage, generated once per browser
async function getWebEncryptionKey(): Promise<CryptoKey> {
  const storedKeyData = localStorage.getItem(WEB_CRYPTO_KEY);

  if (storedKeyData) {
    const keyData = JSON.parse(storedKeyData);
    return await crypto.subtle.importKey(
      "jwk",
      keyData,
      { name: "AES-GCM", length: KEY_LENGTH },
      true,
      ["encrypt", "decrypt"],
    );
  }

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: KEY_LENGTH },
    true,
    ["encrypt", "decrypt"],
  );

  const exportedKey = await crypto.subtle.exportKey("jwk", key);
  localStorage.setItem(WEB_CRYPTO_KEY, JSON.stringify(exportedKey));

  return key;
}

// Generate random bytes
function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// Encrypt a string value using AES-GCM
export async function encryptForWeb(plaintext: string): Promise<string> {
  try {
    const key = await getWebEncryptionKey();

    // IV (Initialization Vector)
    const iv = generateRandomBytes(IV_LENGTH);

    // Convert plaintext to bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv as BufferSource },
      key,
      data as BufferSource,
    );

    // Combine IV + encrypted data
    const encryptedArray = new Uint8Array(encryptedData);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv, 0);
    combined.set(encryptedArray, iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    logger.error("Web encryption failed:", error as Error, {
      component: "web-crypto",
      operation: "encryptForWeb",
      metadata: {
        plaintext,
      },
    });
    throw error;
  }
}

// Decrypt a string value using AES-GCM
export async function decryptForWeb(ciphertext: string): Promise<string> {
  try {
    const key = await getWebEncryptionKey();

    const combined = new Uint8Array(
      atob(ciphertext)
        .split("")
        .map((char) => char.charCodeAt(0)),
    );

    const iv = combined.slice(0, IV_LENGTH);
    const encryptedData = combined.slice(IV_LENGTH);

    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv as BufferSource },
      key,
      encryptedData as BufferSource,
    );

    // Convert bytes to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    logger.error("Web decryption failed:", error as Error, {
      component: "web-crypto",
      operation: "decryptForWeb",
      metadata: {
        ciphertext,
      },
    });
    throw error;
  }
}

export function clearWebEncryptionKey(): void {
  localStorage.removeItem(WEB_CRYPTO_KEY);
}

export function isEncrypted(value: string): boolean {
  try {
    atob(value);
    return value.length > 20 && /^[A-Za-z0-9+/=]+$/.test(value);
  } catch {
    return false;
  }
}
