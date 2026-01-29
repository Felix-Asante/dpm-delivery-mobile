import { ShipmentStatus } from "@/types/enums/shipment.enum";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface UpdateStatusModalProps {
  visible: boolean;
  onClose: () => void;
  shipmentId: string;
  currentStatus: string;
}

export function UpdateStatusModal({
  visible,
  onClose,
  shipmentId,
  currentStatus,
}: UpdateStatusModalProps) {
  const statusOptions = [
    {
      value: ShipmentStatus.PICKUP_CONFIRMED,
      label: "Pickup Confirmed",
      icon: "checkmark-circle" as const,
      description: "Package picked up from sender",
    },
    {
      value: ShipmentStatus.IN_TRANSIT,
      label: "In Transit",
      icon: "navigate" as const,
      description: "Package is on the way",
    },
    {
      value: ShipmentStatus.ARRIVED,
      label: "Arrived",
      icon: "location" as const,
      description: "Arrived at destination area",
    },
    {
      value: ShipmentStatus.OUT_FOR_DELIVERY,
      label: "Out for Delivery",
      icon: "bicycle" as const,
      description: "Final delivery in progress",
    },
    {
      value: ShipmentStatus.DELIVERED,
      label: "Delivered",
      icon: "checkmark-done-circle" as const,
      description: "Successfully delivered to recipient",
    },
    {
      value: ShipmentStatus.FAILED_DELIVERY_ATTEMPT,
      label: "Failed Delivery",
      icon: "close-circle" as const,
      description: "Delivery attempt unsuccessful",
    },
    {
      value: ShipmentStatus.ON_HOLD,
      label: "On Hold",
      icon: "pause-circle" as const,
      description: "Delivery temporarily paused",
    },
  ];

  const handleStatusUpdate = (status: ShipmentStatus) => {
    // TODO: Implement API call to update status
    console.log("Updating status to:", status, "for shipment:", shipmentId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-white rounded-t-3xl">
          {/* Header */}
          <View className="p-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xl text-secondary font-bold">
                Update Order Status
              </Text>
              <Pressable
                onPress={onClose}
                className="bg-gray-100 rounded-full p-2 active:bg-gray-200"
              >
                <Ionicons name="close" size={20} color="#6b7280" />
              </Pressable>
            </View>
            <Text className="text-sm text-gray-500">
              Select the new status for this shipment
            </Text>
          </View>

          {/* Status Options */}
          <ScrollView
            className="max-h-96"
            showsVerticalScrollIndicator={false}
          >
            <View className="p-4 gap-2">
              {statusOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => handleStatusUpdate(option.value)}
                  disabled={currentStatus === option.value}
                  className={`${
                    currentStatus === option.value
                      ? "bg-accent/10 border-accent"
                      : "bg-white border-gray-200"
                  } border rounded-2xl p-4 active:bg-gray-50`}
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className={`${
                        currentStatus === option.value
                          ? "bg-accent/20"
                          : "bg-gray-100"
                      } rounded-full p-3`}
                    >
                      <Ionicons
                        name={option.icon}
                        size={24}
                        color={
                          currentStatus === option.value ? "#f97316" : "#6b7280"
                        }
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text
                          className={`${
                            currentStatus === option.value
                              ? "text-accent"
                              : "text-secondary"
                          } text-base font-semibold`}
                        >
                          {option.label}
                        </Text>
                        {currentStatus === option.value && (
                          <View className="bg-accent/20 rounded-full px-2 py-0.5">
                            <Text className="text-accent text-xs font-semibold">
                              Current
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-sm text-gray-600 mt-0.5">
                        {option.description}
                      </Text>
                    </View>
                    {currentStatus !== option.value && (
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#9ca3af"
                      />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
