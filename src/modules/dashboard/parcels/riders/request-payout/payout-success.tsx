import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export function PayoutSuccess() {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <View className="items-center">
        <View className="bg-green-100 rounded-full p-6 mb-4">
          <Ionicons name="checkmark-circle" size={64} color="#10b981" />
        </View>
        <Text className="text-xl font-bold text-green-600 mb-2">
          Request Submitted!
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          Your withdrawal request will be processed shortly
        </Text>
      </View>
    </View>
  );
}
