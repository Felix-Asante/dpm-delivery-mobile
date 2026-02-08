import { FormField } from "@/components/form-field";
import { SelectField } from "@/components/select-field";
import { MOBILE_MONEY_PROVIDERS } from "@/constants/data";
import type { PayoutRequestFormData } from "@/modules/dashboard/parcels/validations/payout.validation";
import React from "react";
import { Control } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";

type MobileMoneyFieldProps = {
  control: Control<PayoutRequestFormData, any, any>;
  isVerifying: boolean;
};

export function MobileMoneyField(props: MobileMoneyFieldProps) {
  const { control, isVerifying = false } = props;
  return (
    <View className="gap-4">
      <SelectField
        control={control}
        name="mobileMoneyProvider"
        label="Mobile Money Provider *"
        placeholder="Select provider"
        options={MOBILE_MONEY_PROVIDERS}
      />

      <View>
        <Text className="text-sm font-medium text-secondary mb-2">
          Mobile Money Number *
        </Text>
        <View className="relative">
          <FormField
            control={control}
            name="mobileMoneyNumber"
            placeholder="e.g., 0241234567"
            keyboardType="phone-pad"
          />
          {isVerifying && (
            <View className="absolute right-3 top-3">
              <ActivityIndicator size="small" color="#3b82f6" />
            </View>
          )}
        </View>
        {isVerifying && (
          <Text className="text-xs text-blue-600 mt-1">
            Verifying account...
          </Text>
        )}
      </View>
    </View>
  );
}
