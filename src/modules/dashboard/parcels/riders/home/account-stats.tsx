import { AppConfig } from "@/constants/config";
import { getRiderAccountStatQueryOptions } from "@/lib/tanstack-query/query-options/users";
import { formatCurrency } from "@/utils/currency";
import { Storage, StorageKeys } from "@/utils/storage";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "heroui-native";
import React from "react";
import { FlatList, Text, View } from "react-native";

interface RiderAccountStatsProps {
  totalEarnings: number;
}

export function RiderAccountStats({ totalEarnings }: RiderAccountStatsProps) {
  const user = Storage.getObject(StorageKeys.USER);

  const { data: accountStatsResponse, isLoading } = useQuery(
    getRiderAccountStatQueryOptions(user.id),
  );

  const totalRevenue = totalEarnings;
  const totalDeliveriesToday =
    accountStatsResponse?.data?.total_deliveries_today;
  const totalDeliveries = accountStatsResponse?.data?.total_orders_delivered;
  const totalCancelledOrders =
    accountStatsResponse?.data?.total_orders_cancelled;

  const STATS = [
    {
      label: "Total revenue",
      value: `${AppConfig.currency.symbol} ${formatCurrency(totalRevenue)}`,
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
            {isLoading ? (
              <Skeleton className="w-24 h-6 rounded-lg" />
            ) : (
              <Text className="font-semibold text-lg">{item.value}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
