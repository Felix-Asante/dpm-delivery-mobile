import { AppConfig } from "@/constants/config";
import type { User } from "@/types/auth.types";
import { getInitials } from "@/utils/common";
import { Storage, StorageKeys } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Button } from "heroui-native";
import React from "react";
import { ImageBackground, Text, View } from "react-native";

export function RidersHomePage() {
  const user = Storage.getObject(StorageKeys.USER) as User;

  return (
    <View className="pt-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg text-secondary font-semibold line-clamp-1">
          Hello{" "}
          <Text className="text-accent line-clamp-1">{user.fullName}</Text> 👋
        </Text>
        <Avatar size="sm" alt={user.fullName} className="bg-accent">
          <Avatar.Image source={{ uri: "" }} />
          <Avatar.Fallback textProps={{ className: "tex-white text-lg" }}>
            {getInitials(user.fullName)}
          </Avatar.Fallback>
        </Avatar>
      </View>
      {/* wallet section */}
      <View className="rounded-2xl mt-4 relative">
        <View className="bg-[#080a0b]/90 absolute top-0 left-0 right-0 bottom-0 w-full h-full z-10 rounded-2xl" />
        <ImageBackground source={require("@/assets/images/level-curves.png")}>
          <View className="p-4 z-20">
            <View className="flex-row items-center gap-2 mb-1">
              <Ionicons name="wallet-outline" size={20} color="white" />
              <Text className="text-lg text-white font-semibold">Balance</Text>
            </View>
            <Text className="text-xs text-white/70 font-medium mb-3">
              Your total available earnings
            </Text>
            <View className="flex-row items-baseline gap-2 mb-4">
              <Text className="text-3xl text-white font-bold">
                {AppConfig.currency.symbol} 0.00
              </Text>
              <Text className="text-sm text-white/60">
                {AppConfig.currency.label}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Button size="sm" className="rounded-full flex-1">
                <Ionicons name="cash-outline" size={16} color="white" />
                <Text className="text-white font-medium ml-1">
                  Request Payment
                </Text>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="flex-1 border-white/20"
              >
                <Ionicons name="list-outline" size={16} color="white" />
                <Text className="text-white font-medium ml-1">
                  Transactions
                </Text>
              </Button>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}
