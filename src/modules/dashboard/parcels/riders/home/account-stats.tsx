import { AppConfig } from "@/constants/config";
import React from "react";
import { FlatList, Text, View } from "react-native";

interface RiderAccountStatsProps {
  totalEarnings: number;
}

export function RiderAccountStats({ totalEarnings }: RiderAccountStatsProps) {
  const totalRevenue = totalEarnings;
  const totalDeliveriesToday = 0;
  const totalDeliveries = 0;
  const totalCancelledOrders = 0;

  const STATS = [
    {
      label: "Total revenue",
      value: `${AppConfig.currency.symbol} ${totalRevenue.toFixed(2)}`,
    },
    {
      label: "Total deliveries today",
      value: totalDeliveriesToday,
    },
    {
      label: "Total deliveries",
      value: totalDeliveries,
    },
    {
      label: "Cancelled Orders",
      value: totalCancelledOrders,
    },
  ];

  return (
    <View className="mt-4">
      <Text className="text-base text-secondary font-semibold mb-2">
        Statistics
      </Text>
      <FlatList
        data={STATS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 16,
        }}
        renderItem={({ item }) => (
          <View
            key={item.label}
            className="bg-muted/10 rounded-lg p-4 min-w-[230px] md:min-w-0 md:flex-1"
          >
            <Text className="text-gray-500 text-sm h-14">{item.label}</Text>
            <Text className="font-semibold text-lg">{item.value}</Text>
          </View>
        )}
      />
    </View>
  );
}
