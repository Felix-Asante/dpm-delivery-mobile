import { FormField } from "@/components/form-field";
import ImagePicker from "@/components/image-picker";
import { riderUpdateStatusOptions } from "@/constants/ride-status";
import { ShipmentStatus } from "@/types/enums/shipment.enum";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "heroui-native";
import React from "react";
import { useForm } from "react-hook-form";
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
  const form = useForm();

  const handleStatusUpdate = (status: ShipmentStatus) => {
    // TODO: Implement API call to update status
    console.log("Updating status to:", status, "for shipment:", shipmentId);
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
            className="max-h-[75%]"
            showsVerticalScrollIndicator={false}
          >
            <View className="p-4 gap-2">
              {riderUpdateStatusOptions.map((option) => (
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
              <View className="mt-2 gap-4">
                <FormField
                  control={form.control}
                  name="reason"
                  label="Reason"
                  placeholder="Enter reason for status change"
                />
                <ImagePicker
                  label="Proof of Delivery"
                  description="Upload clear photos of the delivered parcel"
                  allowsMultiple={true}
                  maxImages={3}
                  // errorMessage="At least one photo is required"
                  onImagesChange={(images) => console.log("photos", images)}
                  allowedImageTypes={["jpg", "jpeg", "png"]}
                />
              </View>
            </View>
          </ScrollView>
          <Button
            className="mx-5"
            onPress={() => handleStatusUpdate(ShipmentStatus.DELIVERED)}
          >
            Update Status
          </Button>
        </View>
      </View>
    </Modal>
  );
}
