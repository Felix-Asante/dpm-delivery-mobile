import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { createMMKV } from "react-native-mmkv";
import { ENV } from "./env";
import { decryptForWeb, encryptForWeb } from "./web-crypto";

export enum StorageKeys {
  AUTH_TOKEN = "auth_token",
  REFRESH_TOKEN = "refresh_token",
  USER = "user",
  DEVICE_KEY = "__device_key",
  WEB_CRYPTO_KEY = "__web_crypto_key",
}

const ENCRYPTION_KEY = ENV.encryptionKey || "";

async function getWebEncryptionKey(): Promise<string> {
  const stored = localStorage.getItem(StorageKeys.DEVICE_KEY);
  if (stored) return stored;

  const key = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${Date.now()}:${Math.random()}`,
  );

  localStorage.setItem(StorageKeys.DEVICE_KEY, key);
  return key;
}

export async function getDeviceEncryptionKey(): Promise<string> {
  if (Platform.OS === "web") {
    return await getWebEncryptionKey();
  }

  const deviceId = await DeviceInfo.getUniqueId();

  const key = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${deviceId}:${ENCRYPTION_KEY}`,
  );

  return key;
}

const mmkvStorage = createMMKV({
  encryptionKey: Platform.OS === "web" ? undefined : ENCRYPTION_KEY,
  id: Platform.OS === "web" ? "" : "mmkv_storage",
});

const setItem = (key: StorageKeys, value: string) => {
  mmkvStorage.set(key, value);
};

const getString = (key: StorageKeys, defaultValue?: string) => {
  return mmkvStorage.getString(key) || defaultValue || "";
};

const setObject = (key: StorageKeys, value: any) => {
  mmkvStorage.set(key, JSON.stringify(value));
};

const getObject = (key: StorageKeys, defaultValue?: any) => {
  const value = mmkvStorage.getString(key);
  return value ? JSON.parse(value) : defaultValue;
};

const removeItem = (key: StorageKeys) => {
  mmkvStorage.remove(key);
};

async function setToken(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    const encrypted = await encryptForWeb(value);
    localStorage.setItem(key, encrypted);
  } else {
    await SecureStore.setItemAsync(key, value, {
      // can only access when device is unlocked
      // keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  }
}

async function getToken(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return await decryptForWeb(encrypted);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

async function deleteToken(key: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const Storage = {
  setItem,
  getString,
  setObject,
  getObject,
  removeItem,
  setToken,
  getToken,
  deleteToken,
};
