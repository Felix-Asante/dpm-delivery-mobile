import { ShipmentCard } from "@/components/shipment-card";
import { api } from "@/services/api";
import { ShipmentStatus } from "@/types/enums/shipment.enum";
import type { Shipment } from "@/types/shipment.types";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link, useFocusEffect } from "expo-router";
import { Chip, Skeleton } from "heroui-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const FILTER_OPTIONS = [
  { value: "all", label: "All Orders", icon: "apps" as const },

  {
    value: ShipmentStatus.RIDER_ASSIGNED,
    label: "Assigned",
    icon: "bicycle" as const,
  },
  {
    value: ShipmentStatus.IN_TRANSIT,
    label: "In Transit",
    icon: "bicycle" as const,
  },
  {
    value: ShipmentStatus.OUT_FOR_DELIVERY,
    label: "Out for Delivery",
    icon: "navigate" as const,
  },
  {
    value: ShipmentStatus.PICKUP_CONFIRMED,
    label: "Pickup Confirmed",
    icon: "checkmark-circle" as const,
  },
  {
    value: ShipmentStatus.DELIVERED,
    label: "Delivered",
    icon: "checkmark-circle" as const,
  },
  {
    value: ShipmentStatus.FAILED_DELIVERY_ATTEMPT,
    label: "Failed Delivery Attempt",
    icon: "close-circle" as const,
  },
  {
    value: ShipmentStatus.REPACKAGED,
    label: "Repackaged",
    icon: "refresh" as const,
  },
  {
    value: ShipmentStatus.REFUNDED,
    label: "Refunded",
    icon: "cash" as const,
  },
  {
    value: ShipmentStatus.ARRIVED,
    label: "Arrived at Destination",
    icon: "location" as const,
  },
  {
    value: ShipmentStatus.PAYMENT_RECEIVED,
    label: "Payment Received",
    icon: "card" as const,
  },
  {
    value: ShipmentStatus.ON_HOLD,
    label: "On Hold",
    icon: "pause-circle" as const,
  },
  {
    value: ShipmentStatus.RETURNED,
    label: "Returned",
    icon: "return-up-back" as const,
  },
];

export default function History() {
  const [selectedFilter, setSelectedFilter] = React.useState<string>("all");

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["shipments", "infinite", selectedFilter],
    queryFn: ({ pageParam = 1 }) => {
      const params: { limit: number; page: number; status?: string } = {
        limit: 8,
        page: pageParam,
      };
      if (selectedFilter !== "all") {
        params.status = selectedFilter;
      }
      return api.shipments.list(params);
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.meta.currentPage;
      const totalPages = lastPage.data.meta.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Flatten all pages into a single array
  const shipments: Shipment[] = React.useMemo(
    () => data?.pages.flatMap((page) => page.data.items) || [],
    [data],
  );

  const totalItems = data?.pages[0]?.data.meta?.totalItems || 0;

  return (
    <View className="flex-1 bg-white">
      <View className="px-5 pt-safe pb-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-bold text-secondary">
            Order History
          </Text>
          <View className="bg-accent/10 rounded-full px-3 py-1.5">
            <Text className="text-accent font-semibold text-sm">
              {totalItems} {totalItems === 1 ? "order" : "orders"}
            </Text>
          </View>
        </View>
        <Text className="text-sm text-gray-500">
          Track and manage all your delivery orders
        </Text>
      </View>

      <View className="border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5 py-4 gap-2"
        >
          {FILTER_OPTIONS.map((filter) => {
            const isSelected = selectedFilter === filter.value;
            return (
              <Pressable key={filter.value}>
                <Chip
                  variant={isSelected ? "primary" : "secondary"}
                  size="sm"
                  className={
                    isSelected ? "bg-accent border-accent" : "border-gray-300"
                  }
                  onPress={() => {
                    setSelectedFilter(filter.value);
                  }}
                >
                  <View className="flex-row items-center gap-1.5 px-1">
                    <Ionicons
                      name={filter.icon}
                      size={14}
                      color={isSelected ? "#fff" : "#6b7280"}
                    />
                    <Text
                      className={`text-xs font-medium ${
                        isSelected ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {filter.label}
                    </Text>
                  </View>
                </Chip>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <View className="flex-1 px-5">
        {isLoading ? (
          <Loader />
        ) : shipments.length === 0 ? (
          <EmptyState selectedFilter={selectedFilter} />
        ) : (
          <FlashList
            data={shipments}
            renderItem={({ item }) => (
              <Link asChild href={`/shipments/${item.reference}`}>
                <ShipmentCard shipment={item} />
              </Link>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View className="py-4 items-center">
                  <Skeleton
                    className="h-32 w-full rounded-xl opacity-25"
                    animation={{
                      shimmer: {
                        highlightColor: "rgba(242, 242, 242, 0.2)",
                      },
                    }}
                  />
                </View>
              ) : hasNextPage ? (
                <View className="py-4 items-center">
                  <Text className="text-xs text-gray-400">
                    Pull to load more
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}

function EmptyState({ selectedFilter }: { selectedFilter: string }) {
  const filterLabel =
    FILTER_OPTIONS.find((f) => f.value === selectedFilter)?.label ||
    "All Orders";

  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View className="bg-gray-50 rounded-full p-6 mb-4">
        <Ionicons name="folder-open-outline" size={48} color="#9ca3af" />
      </View>

      <Text className="text-xl font-bold text-secondary text-center mb-2">
        No Orders Found
      </Text>

      <Text className="text-sm text-gray-500 text-center leading-5">
        {selectedFilter === "all"
          ? "You don't have any order history yet. Once you start accepting deliveries, they'll appear here."
          : `No orders found with status "${filterLabel}". Try selecting a different filter.`}
      </Text>

      {selectedFilter !== "all" && (
        <View className="mt-6">
          <View className="bg-accent/5 rounded-lg px-4 py-3 flex-row items-center gap-2">
            <Ionicons name="information-circle" size={20} color="#f97316" />
            <Text className="text-xs text-gray-600 flex-1">
              Tip: Select &quot;All Orders&quot; to see your complete history
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

function Loader() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 16 }}
    >
      <View className="gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i + 1}
            className="h-48 w-full rounded-2xl opacity-25"
            animation={{
              shimmer: {
                highlightColor: "rgba(242, 242, 242, 0.2)",
              },
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}
