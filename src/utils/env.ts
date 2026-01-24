function validateEnv(env: string | undefined) {
  if (!env) {
    throw new Error(`Environment variable ${env} is not defined`);
  }
  return env.trim();
}

export const ENV = {
  encryptionKey: validateEnv(process.env.EXPO_PUBLIC_ENCRYPTION_KEY),
  apiBaseUrl: validateEnv(process.env.EXPO_PUBLIC_API_BASE_URL),
  webCryptoKey: validateEnv(process.env.EXPO_PUBLIC_WEB_CRYPTO_KEY),
};
