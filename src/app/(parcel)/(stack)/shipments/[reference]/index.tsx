import { getShipmentByReferenceQueryOptions } from "@/lib/tanstack-query/query-options/shipment";
import { UpdateStatusModal } from "@/modules/dashboard/parcels/riders/shipment/update-status-modal";
import { ShipmentStatus } from "@/types/enums/shipment.enum";
import { getShipmentOptionDisplay } from "@/utils/enum-helpers";
import { getStatusColor, getStatusTextColor } from "@/utils/style";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Skeleton } from "heroui-native";
import React, { useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";

export default function ShipmentDetail() {
  const { reference } = useLocalSearchParams();
  const router = useRouter();
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] =
    useState(false);

  const { data, isLoading } = useQuery(
    getShipmentByReferenceQueryOptions(reference as string),
  );

  const shipment = data?.data;

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleMessage = (phone: string) => {
    Linking.openURL(`sms:${phone}`);
  };

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "payment_received":
        return "#15803d";
      case "failed_delivery_attempt":
      case "on_hold":
      case "returned":
        return "#b91c1c";
      default:
        return "#f97316";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    // return format(new Date(date), "MMM dd, yyyy • HH:mm");
    return new Date(date).toLocaleString();
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <ScrollView className="flex-1 p-4">
          <Skeleton className="h-24 w-full rounded-2xl mb-4" />
          <Skeleton className="h-48 w-full rounded-2xl mb-4" />
          <Skeleton className="h-32 w-full rounded-2xl mb-4" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </ScrollView>
      </View>
    );
  }

  if (!shipment) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Ionicons name="alert-circle-outline" size={64} color="#9ca3af" />
        <Text className="text-lg text-gray-600 font-semibold mt-4 mb-2">
          Shipment Not Found
        </Text>
        <Text className="text-sm text-gray-500 text-center mb-6">
          The shipment you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </Text>
        <Button onPress={() => router.back()} className="rounded-xl">
          Go Back
        </Button>
      </View>
    );
  }

  const isDelivered = shipment.status === ShipmentStatus.DELIVERED;

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Delivered Success Banner */}
        {isDelivered && (
          <View className="bg-green-50 p-6 border-b border-green-100">
            <View className="items-center">
              <View className="bg-green-100 rounded-full p-4 mb-3">
                <Ionicons name="checkmark-circle" size={56} color="#15803d" />
              </View>
              <Text className="text-2xl text-green-800 font-bold mb-2">
                Successfully Delivered!
              </Text>
              <Text className="text-sm text-green-700 text-center mb-1">
                This package has been delivered to the recipient
              </Text>
              <Text className="text-xs text-green-600">
                Reference: #{shipment.reference}
              </Text>
            </View>
          </View>
        )}

        {/* Header Card - Status & Reference (for non-delivered orders) */}
        {!isDelivered && (
          <View className="bg-gray-50 p-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-3">
              <View
                className={`${getStatusColor(shipment.status)} rounded-full px-4 py-2 flex-row items-center gap-2`}
              >
                <Ionicons
                  name="cube"
                  size={16}
                  color={getStatusIconColor(shipment.status)}
                />
                <Text
                  className={`${getStatusTextColor(shipment.status)} text-sm font-bold`}
                >
                  {formatStatus(shipment.status)}
                </Text>
              </View>
            </View>
            <Text className="text-xs text-gray-500 mb-1">Reference Number</Text>
            <Text className="text-2xl text-secondary font-bold">
              #{shipment.reference}
            </Text>
          </View>
        )}

        <View className="p-4">
          {/* Route Information */}
          <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
            <Text className="text-base text-secondary font-bold mb-4">
              Delivery Route
            </Text>

            <View className="flex-row items-start">
              {/* Route Line */}
              <View className="items-center mr-3 pt-1">
                <View className="w-3 h-3 rounded-full bg-accent" />
                <View className="w-0.5 h-16 bg-gray-200 my-1" />
                <View className="w-3 h-3 rounded-full bg-accent" />
              </View>

              {/* Addresses */}
              <View className="flex-1">
                {/* Pickup */}
                <View className="mb-6">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Ionicons name="location" size={16} color="#f97316" />
                    <Text className="text-xs text-gray-500 font-semibold uppercase">
                      Pickup Location
                    </Text>
                  </View>
                  <Text className="text-base text-secondary font-semibold mb-1">
                    {shipment.pickupArea}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {shipment.pickupCity}
                  </Text>
                  {shipment.pickupDate && (
                    <View className="flex-row items-center gap-1 mt-2">
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <Text className="text-xs text-gray-500">
                        {formatDate(shipment.pickupDate)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Dropoff */}
                <View>
                  <View className="flex-row items-center gap-2 mb-2">
                    <Ionicons name="location" size={16} color="#6b7280" />
                    <Text className="text-xs text-gray-500 font-semibold uppercase">
                      Drop-off Location
                    </Text>
                  </View>
                  <Text className="text-base text-secondary font-semibold mb-1">
                    {shipment.dropOffArea}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {shipment.dropOffCity}
                  </Text>
                  {shipment.dropOffDate && (
                    <View className="flex-row items-center gap-1 mt-2">
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <Text className="text-xs text-gray-500">
                        {formatDate(shipment.dropOffDate)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Contact Cards */}
          <View className="mb-4">
            <Text className="text-base text-secondary font-bold mb-3">
              Contact Information
            </Text>

            {/* Sender Contact */}
            <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="bg-accent/10 rounded-full p-2">
                      <Ionicons name="person" size={16} color="#f97316" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 font-medium">
                        Sender
                      </Text>
                      <Text className="text-base text-secondary font-semibold">
                        {shipment.senderPhone}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => handleCall(shipment.senderPhone)}
                    className="bg-accent/10 rounded-full p-3 active:bg-accent/20"
                  >
                    <Ionicons name="call" size={20} color="#f97316" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleMessage(shipment.senderPhone)}
                    className="bg-secondary/10 rounded-full p-3 active:bg-secondary/20"
                  >
                    <Ionicons name="chatbubble" size={20} color="#1e293b" />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Recipient Contact */}
            <View className="bg-white rounded-2xl p-4 border border-gray-100">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="bg-accent/10 rounded-full p-2">
                      <Ionicons name="person" size={16} color="#f97316" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 font-medium">
                        Recipient
                      </Text>
                      <Text className="text-base text-secondary font-semibold">
                        {shipment.recipientPhone}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => handleCall(shipment.recipientPhone)}
                    className="bg-accent/10 rounded-full p-3 active:bg-accent/20"
                  >
                    <Ionicons name="call" size={20} color="#f97316" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleMessage(shipment.recipientPhone)}
                    className="bg-secondary/10 rounded-full p-3 active:bg-secondary/20"
                  >
                    <Ionicons name="chatbubble" size={20} color="#1e293b" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {/* Shipment Details */}
          <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
            <Text className="text-base text-secondary font-bold mb-4">
              Shipment Details
            </Text>

            <View className="gap-3">
              {/* Mode of Shipment */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name={
                      shipment.modeOfShipment === "Bike"
                        ? "bicycle"
                        : shipment.modeOfShipment === "Van"
                          ? "car"
                          : "cart"
                    }
                    size={18}
                    color="#6b7280"
                  />
                  <Text className="text-sm text-gray-600">Vehicle Type</Text>
                </View>
                <Text className="text-sm text-secondary font-semibold">
                  {shipment.modeOfShipment}
                </Text>
              </View>

              <View className="h-px bg-gray-100" />

              {/* Shipment Option */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="cube-outline" size={18} color="#6b7280" />
                  <Text className="text-sm text-gray-600">Shipment Option</Text>
                </View>
                <Text className="text-sm text-secondary font-semibold capitalize">
                  {getShipmentOptionDisplay(shipment.shipmentOption)}
                </Text>
              </View>

              <View className="h-px bg-gray-100" />

              {/* Created Date */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="calendar-outline" size={18} color="#6b7280" />
                  <Text className="text-sm text-gray-600">Created</Text>
                </View>
                <Text className="text-sm text-secondary font-semibold">
                  {formatDate(shipment.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Information */}
          {shipment.shipmentCost && (
            <View className="bg-accent/5 rounded-2xl p-4 mb-4 border border-accent/20">
              <Text className="text-base text-secondary font-bold mb-4">
                Payment Summary
              </Text>

              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">Pickup Fee</Text>
                  <Text className="text-sm text-secondary font-semibold">
                    ${shipment.shipmentCost.pickupFee}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">Delivery Fee</Text>
                  <Text className="text-sm text-secondary font-semibold">
                    ${shipment.shipmentCost.deliveryFee}
                  </Text>
                </View>

                {shipment.shipmentCost.includeRepackagingFee && (
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-gray-600">
                      Repackaging Fee
                    </Text>
                    <Text className="text-sm text-secondary font-semibold">
                      ${shipment.shipmentCost.repackagingFee}
                    </Text>
                  </View>
                )}

                <View className="h-px bg-accent/20 my-1" />

                <View className="flex-row items-center justify-between">
                  <Text className="text-base text-secondary font-bold">
                    Total Cost
                  </Text>
                  <Text className="text-xl text-accent font-bold">
                    ${shipment.shipmentCost.totalCost}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">Your Commission</Text>
                  <Text className="text-base text-accent font-bold">
                    ${shipment.shipmentCost.riderCommission}
                  </Text>
                </View>

                <View className="mt-2">
                  <View
                    className={`${
                      shipment.shipmentCost.paid
                        ? "bg-green-100"
                        : "bg-yellow-100"
                    } rounded-full px-4 py-2 flex-row items-center justify-center gap-2`}
                  >
                    <Ionicons
                      name={
                        shipment.shipmentCost.paid ? "checkmark-circle" : "time"
                      }
                      size={16}
                      color={shipment.shipmentCost.paid ? "#22c55e" : "#eab308"}
                    />
                    <Text
                      className={`${
                        shipment.shipmentCost.paid
                          ? "text-green-600"
                          : "text-yellow-600"
                      } text-sm font-semibold`}
                    >
                      {shipment.shipmentCost.paid ? "Paid" : "Pending Payment"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Extra Information */}
          {shipment.extraInformation && (
            <View className="bg-accent/5 rounded-2xl p-4 mb-4 border border-accent/20">
              <View className="flex-row items-start gap-2">
                <Ionicons name="information-circle" size={20} color="#f97316" />
                <View className="flex-1">
                  <Text className="text-sm text-secondary font-semibold mb-1">
                    Additional Notes
                  </Text>
                  <Text className="text-sm text-secondary/70">
                    {shipment.extraInformation}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button/Status - Fixed at bottom */}
      <View className="p-4 border-t border-gray-100 bg-white">
        {isDelivered ? (
          <View className="bg-green-50 rounded-xl p-4">
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="checkmark-circle" size={24} color="#15803d" />
              <Text className="text-green-800 font-bold text-base">
                Order Completed
              </Text>
            </View>
            {shipment.dropOffDate && (
              <Text className="text-xs text-green-600 text-center mt-2">
                Delivered on {formatDate(shipment.dropOffDate)}
              </Text>
            )}
          </View>
        ) : (
          <Button
            onPress={() => setIsUpdateStatusModalVisible(true)}
            className="rounded-xl"
            size="lg"
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Update Status</Text>
          </Button>
        )}
      </View>

      {/* Update Status Modal */}
      <UpdateStatusModal
        visible={isUpdateStatusModalVisible}
        onClose={() => setIsUpdateStatusModalVisible(false)}
        shipmentId={shipment?.id || ""}
        shipmentReference={shipment?.reference || ""}
        currentStatus={shipment?.status || ""}
      />
    </View>
  );
}
