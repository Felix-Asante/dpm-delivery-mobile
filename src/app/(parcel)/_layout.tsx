import { User } from "@/types/auth.types";
import { Storage, StorageKeys } from "@/utils/storage";
import { Redirect, Stack } from "expo-router";

export default function PublicLayout() {
  const user = Storage.getObject(StorageKeys.USER) as User;
  if (!user) {
    return <Redirect href="/(public)/(auth)/sign-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
