import type { Shipment } from "@/types/shipment.types";
import { getStatusColor, getStatusTextColor } from "@/utils/style";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface ShipmentCardProps {
  shipment: Shipment;
  onPress?: () => void;
}

export function ShipmentCard({ shipment, onPress }: ShipmentCardProps) {
  const formattedDate = shipment.dropOffDate
    ? new Date(shipment.dropOffDate).toLocaleString()
    : "N/A";

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-200 active:bg-gray-50"
    >
      {/* Status Badge */}
      <View className="flex-row items-center justify-between mb-3">
        <View
          className={`${getStatusColor(shipment.status)} rounded-full px-3 py-1 flex-row items-center gap-1`}
        >
          <Ionicons name="cube" size={14} color="#0891b2" />
          <Text
            className={`${getStatusTextColor(shipment.status)} text-xs font-semibold`}
          >
            {formatStatus(shipment.status)}
          </Text>
        </View>
      </View>

      {/* Route Information */}
      <View className="flex-row items-start mb-4">
        {/* Route Line */}
        <View className="items-center mr-3">
          <View className="w-3 h-3 rounded-full bg-orange-500" />
          <View className="w-0.5 h-8 bg-gray-300 my-1" />
          <View className="w-3 h-3 rounded-full bg-cyan-500" />
        </View>

        {/* Addresses */}
        <View className="flex-1">
          {/* Pickup */}
          <View className="mb-4">
            <View className="flex-row items-center gap-1 mb-1">
              <Ionicons name="location" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-500 font-medium">Pickup</Text>
            </View>
            <Text
              className="text-sm text-secondary font-semibold"
              numberOfLines={1}
            >
              {shipment.pickupArea}, {shipment.pickupCity}
            </Text>
          </View>

          {/* Dropoff */}
          <View>
            <View className="flex-row items-center gap-1 mb-1">
              <Ionicons name="location" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-500 font-medium">
                Drop-off
              </Text>
            </View>
            <Text
              className="text-sm text-secondary font-semibold"
              numberOfLines={1}
            >
              {shipment.dropOffArea}, {shipment.dropOffCity}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-100 mb-3" />

      {/* Bottom Info */}
      <View className="flex-row items-center justify-between">
        {/* Recipient */}
        <View className="flex-row items-center gap-2 flex-1">
          <View className="flex-row items-center gap-1">
            <Ionicons name="person" size={14} color="#6b7280" />
            <Text className="text-xs text-gray-600" numberOfLines={1}>
              {shipment.recipientPhone}
            </Text>
          </View>
        </View>

        {/* Time */}
        <View className="flex-row items-center gap-1">
          <Ionicons name="time" size={14} color="#6b7280" />
          <Text className="text-xs text-gray-600">{formattedDate}</Text>
        </View>
      </View>

      {/* Additional Info Row */}
      <View className="flex-row items-center gap-4 mt-3">
        {/* Items Count */}
        <View className="flex-row items-center gap-1">
          <Ionicons name="cube-outline" size={14} color="#6b7280" />
          <Text className="text-xs text-gray-600">
            Items ({shipment.history?.length || 1})
          </Text>
        </View>

        {/* Shipment Mode */}
        {shipment.modeOfShipment && (
          <View className="flex-row items-center gap-1">
            <Ionicons
              name={shipment.modeOfShipment === "Bike" ? "bicycle" : "car"}
              size={14}
              color="#6b7280"
            />
            <Text className="text-xs text-gray-600">
              {shipment.modeOfShipment}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
