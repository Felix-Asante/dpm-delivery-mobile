import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { UpdateShipmentStatusForm } from "./update-shipment-status-form";

interface UpdateStatusModalProps {
  visible: boolean;
  onClose: () => void;
  shipmentId: string;
  currentStatus: string;
  shipmentReference: string;
}

export function UpdateStatusModal(props: UpdateStatusModalProps) {
  const { visible, onClose, shipmentId, currentStatus, shipmentReference } =
    props;
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

          <View className="h-[75vh]">
            <UpdateShipmentStatusForm
              currentStatus={currentStatus}
              shipmentId={shipmentId}
              shipmentReference={shipmentReference}
              onUpdateStatus={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
