import { ShipmentCard } from "@/components/shipment-card";
import { getShipmentsQueryOptions } from "@/lib/tanstack-query/query-options/shipment";
import { ShipmentStatus } from "@/types/enums/shipment.enum";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { Button, Skeleton } from "heroui-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export function AvailableDeliveries() {
  const { data: shipmentsResponse, isLoading } = useQuery(
    getShipmentsQueryOptions({
      status: ShipmentStatus.RIDER_ASSIGNED,
      limit: 5,
    }),
  );

  const shipments = shipmentsResponse?.data.items || [];

  return (
    <View className="mt-4">
      <Text className="text-base text-secondary font-semibold mb-2">
        Available deliveries
      </Text>
      {isLoading ? (
        <Loader />
      ) : shipments.length === 0 ? (
        <Empty />
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
        />
      )}
    </View>
  );
}

function Empty() {
  const router = useRouter();
  return (
    <View className="p-5 items-center">
      <View className="bg-accent/10 rounded-full p-4 mb-4">
        <Ionicons name="cube-outline" size={24} color="#f97316" />
      </View>

      <Text className="text-lg text-secondary font-bold text-center">
        No Deliveries Available
      </Text>

      <Text className="text-sm text-secondary/60 text-center mb-2 px-4">
        There are no delivery requests at the moment. Check back soon or refresh
        to see new opportunities.
      </Text>

      <View className="flex-row gap-3 w-full">
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 rounded-xl border-accent"
          onPress={() => {
            router.push("/(parcel)/(tabs)/history");
          }}
        >
          <Ionicons name="search" size={16} color="#f97316" />
          <Text className="text-accent font-medium ml-1">Browse All</Text>
        </Button>
      </View>

      {/* <View className="flex-row items-center gap-2 mt-6 bg-accent/5 rounded-lg px-4 py-3">
        <Ionicons name="information-circle" size={20} color="#f97316" />
        <Text className="text-xs text-secondary/70 flex-1">
          Enable notifications to get alerts for new deliveries
        </Text>
      </View> */}
    </View>
  );
}

function Loader() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i + 1}
            className="h-32 w-full rounded-xl opacity-25"
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
