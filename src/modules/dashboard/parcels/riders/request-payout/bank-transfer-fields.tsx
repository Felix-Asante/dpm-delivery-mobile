import { FormField } from "@/components/form-field";
import type { PayoutRequestFormData } from "@/modules/dashboard/parcels/validations/payout.validation";
import { type Control } from "react-hook-form";
import { View } from "react-native";

type BankTransferFieldsProps = {
  control: Control<PayoutRequestFormData, any, any>;
};

export function BankTransferFields(props: BankTransferFieldsProps) {
  const { control } = props;
  return (
    <View className="gap-4">
      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            control={control}
            name="accountNumber"
            label="Account Number *"
            placeholder="Enter account number"
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <FormField
            control={control}
            name="accountName"
            label="Account Name *"
            placeholder="Enter account name"
          />
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            control={control}
            name="bankName"
            label="Bank Name *"
            placeholder="e.g., Standard Bank"
          />
        </View>
        <View className="flex-1">
          <FormField
            control={control}
            name="bankCode"
            label="Bank Code (Optional)"
            placeholder="e.g., 001"
          />
        </View>
      </View>
    </View>
  );
}
