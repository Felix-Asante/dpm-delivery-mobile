import { FormField } from "@/components/form-field";
import ImagePicker from "@/components/image-picker";
import { riderUpdateStatusOptions } from "@/constants/ride-status";
import { Logger } from "@/lib/logger";
import { queryKeys } from "@/lib/tanstack-query/query-keys";
import { api } from "@/services/api";
import { ShipmentStatus } from "@/types/enums/shipment.enum";
import { getErrorMessage } from "@/utils/errors";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  ErrorView,
  Spinner,
  useThemeColor,
  useToast,
} from "heroui-native";
import React from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  updateShipmentStatusSchema,
  type UpdateShipmentStatusField,
} from "../../validations/update-shipment-status";

interface UpdateShipmentStatusFormProps {
  currentStatus: string;
  shipmentId: string;
  shipmentReference: string;
  onUpdateStatus?: () => void;
}

const canAddReasons = [
  ShipmentStatus.FAILED_DELIVERY_ATTEMPT,
  ShipmentStatus.REFUNDED,
  ShipmentStatus.REPACKAGED,
  ShipmentStatus.ON_HOLD,
];

const logger = new Logger("UpdateShipmentStatusForm");

export function UpdateShipmentStatusForm(props: UpdateShipmentStatusFormProps) {
  const { currentStatus, shipmentId, shipmentReference, onUpdateStatus } =
    props;

  const form = useForm<UpdateShipmentStatusField>({
    resolver: zodResolver(updateShipmentStatusSchema),
    defaultValues: {
      status: currentStatus,
    },
  });

  const { toast } = useToast();
  const themeColorAccentForeground = useThemeColor("accent-foreground");

  const updateStatusMutation = useMutation({
    mutationFn: (data: FormData) =>
      api.shipments.updateStatus(shipmentId, data),
  });

  const queryClient = useQueryClient();

  const handleStatusUpdate = async (data: UpdateShipmentStatusField) => {
    try {
      if (!shipmentId) {
        toast.show({
          variant: "danger",
          label: "Bad request",
          description: "Order not found",
        });
        return;
      }
      const formData = new FormData();
      formData.append("status", data.status);
      formData.append("description", data.reason || "");
      formData.append("confirmationCode", data.confirmationCode || "");
      formData.append("isPaid", data.paid === true ? "true" : "false");
      if (data.photo) {
        const photo = {
          uri: data.photo?.[0].uri,
          type: data.photo?.[0].type,
          name: data.photo?.[0].name,
        } as any;
        formData.append("photo", photo);
      }
      await updateStatusMutation.mutateAsync(formData);
      toast.show({
        variant: "success",
        label: "Status updated successfully",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.shipments.getByReference(shipmentReference),
      });
      onUpdateStatus?.();
      logger.info("Status updated successfully", {
        shipmentId,
        shipmentReference,
        status: data.status,
      });
    } catch (error) {
      toast.show({
        variant: "danger",
        label: "Failed to update status",
        description: getErrorMessage(error),
      });
      logger.error("Failed to update status", error as Error, {
        shipmentId,
        shipmentReference,
        status: data.status,
        error: getErrorMessage(error),
      });
    }
  };

  const selectedStatus = form.watch("status") as ShipmentStatus;

  const photoError = form.formState.errors.photo?.message as string | undefined;
  const paidError = form.formState.errors?.paid?.message as string | undefined;

  return (
    <View>
      <ScrollView className="max-h-[90%]" showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-2">
          {riderUpdateStatusOptions.map((option) => {
            const isSelected =
              currentStatus === option.value || selectedStatus === option.value;
            const isCurrent = currentStatus === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => {
                  form.reset({
                    status: option.value,
                    reason: "",
                    photo: undefined,
                  });
                }}
                disabled={isCurrent}
                className={`${
                  isSelected
                    ? "bg-accent/10 border-accent"
                    : "bg-white border-gray-200"
                } border rounded-2xl p-4 active:bg-gray-50`}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={`${
                      isSelected ? "bg-accent/20" : "bg-gray-100"
                    } rounded-full p-3`}
                  >
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={isSelected ? "#f97316" : "#6b7280"}
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text
                        className={`${
                          isSelected ? "text-accent" : "text-secondary"
                        } text-base font-semibold`}
                      >
                        {option.label}
                      </Text>
                      {isCurrent && (
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
                  {!isSelected && (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#9ca3af"
                    />
                  )}
                </View>
              </Pressable>
            );
          })}
          <View className="mt-2 gap-4">
            {canAddReasons.includes(selectedStatus) ? (
              <FormField
                control={form.control}
                name="reason"
                label="Reason"
                placeholder="Enter reason for status change"
              />
            ) : null}
            {selectedStatus === ShipmentStatus.PICKUP_CONFIRMED ? (
              <ImagePicker
                label="Proof of Delivery"
                description="Upload clear photos of the delivered parcel"
                allowsMultiple={false}
                maxImages={1}
                errorMessage={photoError}
                onImagesChange={(images) => console.log("photos", images)}
                allowedImageTypes={["jpg", "jpeg", "png"]}
              />
            ) : null}
            {selectedStatus === ShipmentStatus.DELIVERED ? (
              <>
                <FormField
                  control={form.control}
                  name="confirmationCode"
                  label="Confirmation Code"
                  placeholder="Enter confirmation code"
                />
                <View className="flex-row items-center gap-2">
                  <Checkbox
                    isSelected={form.watch("paid")}
                    onSelectedChange={(value) => form.setValue("paid", value)}
                    className="border border-gray-400 shadow-none"
                    isInvalid={!!paidError}
                  />
                  <Text>Has the order been paid?</Text>
                </View>
                <ErrorView isInvalid={!!paidError}>{paidError}</ErrorView>
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <Button
        className="mx-5"
        onPress={() => form.handleSubmit(handleStatusUpdate)()}
        isDisabled={updateStatusMutation.isPending}
      >
        {updateStatusMutation.isPending ? (
          <Spinner color={themeColorAccentForeground} />
        ) : null}
        Update Status
      </Button>
    </View>
  );
}
