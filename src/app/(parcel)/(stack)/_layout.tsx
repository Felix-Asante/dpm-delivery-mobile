import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

export default function StackLayout() {
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(parcel)/(tabs)");
  };
  return (
    <Stack>
      <Stack.Screen
        name="shipments/[reference]/index"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Order details",
          headerLeft: () => (
            <Pressable
              onPress={goBack}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={18} color="black" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="request-payment"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "",
          headerLeft: () => (
            <Pressable
              onPress={goBack}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={18} color="black" />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
