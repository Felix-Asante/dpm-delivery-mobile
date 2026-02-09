import { FormField } from "@/components/form-field";
import { SelectField } from "@/components/select-field";
import { Alert } from "@/components/ui/alert";
import { AppConfig } from "@/constants/config";
import { useVerifyPhoneNumber } from "@/hooks/api/use-verify-phone-number";
import { getUserWalletQueryOptions } from "@/lib/tanstack-query/query-options/users";
import { BankTransferFields } from "@/modules/dashboard/parcels/riders/request-payout/bank-transfer-fields";
import { MobileMoneyField } from "@/modules/dashboard/parcels/riders/request-payout/mobile-money-field";
import { PayoutSuccess } from "@/modules/dashboard/parcels/riders/request-payout/payout-success";
import type { PayoutRequestFormData } from "@/modules/dashboard/parcels/validations/payout.validation";
import { payoutRequestSchema } from "@/modules/dashboard/parcels/validations/payout.validation";
import { api } from "@/services/api";
import { PayoutMethod } from "@/types/enums/payout-enums";
import { formatCurrency } from "@/utils/currency";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Button, Skeleton, useToast } from "heroui-native";
import React, { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function RequestPaymentScreen() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const { data: walletResponse, isLoading: isWalletLoading } = useQuery(
    getUserWalletQueryOptions(),
  );

  const wallet = walletResponse?.data;
  const balance = wallet?.balance ? parseFloat(wallet.balance) : 0;

  const { control, handleSubmit, watch, setValue, reset, formState } =
    useForm<PayoutRequestFormData>({
      resolver: zodResolver(
        payoutRequestSchema,
      ) as Resolver<PayoutRequestFormData>,
      defaultValues: {
        amount: 0,
        payoutMethod: PayoutMethod.MOBILE_MONEY,
      },
    });

  const payoutMethod = watch("payoutMethod");
  const amount = watch("amount");
  const mobileMoneyProvider = watch("mobileMoneyProvider");
  const mobileMoneyNumber = watch("mobileMoneyNumber");

  const requestPayoutMutation = useMutation({
    mutationFn: api.users.createPayoutRequest,
    onSuccess: () => {
      toast.show({
        variant: "success",
        label: "Payout request submitted successfully",
      });
      setSuccess(true);
      reset();
      router.back();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleWithdrawAll = () => {
    const amountValue = balance?.toString() as any;
    setValue("amount", amountValue);
  };

  const {
    isVerifying,
    verificationError,
    verifiedAccountName,
    handleVerifyMobileNumber,
  } = useVerifyPhoneNumber();

  useEffect(() => {
    setValue("mobileMoneyAccountName", verifiedAccountName ?? "");
  }, [verifiedAccountName]);

  // Auto-verify mobile money number when both provider and number are available
  useEffect(() => {
    if (
      payoutMethod === PayoutMethod.MOBILE_MONEY &&
      mobileMoneyProvider &&
      mobileMoneyNumber &&
      mobileMoneyNumber.length >= 10
    ) {
      const timeoutId = setTimeout(() => {
        handleVerifyMobileNumber(mobileMoneyProvider, mobileMoneyNumber);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [
    payoutMethod,
    mobileMoneyProvider,
    mobileMoneyNumber,
    handleVerifyMobileNumber,
  ]);

  const onSubmit = (data: PayoutRequestFormData) => {
    setError(null);
    setSuccess(false);

    // Check if mobile money is verified
    if (
      data.payoutMethod === PayoutMethod.MOBILE_MONEY &&
      !verifiedAccountName
    ) {
      setError("Please verify your mobile money number before submitting");
      return;
    }
    requestPayoutMutation.mutate(data);
  };

  const isSubmitting = requestPayoutMutation.isPending;

  if (success) {
    return <PayoutSuccess />;
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
      bottomOffset={60}
    >
      <View className="p-5">
        <View className="flex-row items-center gap-3 mb-6">
          <View className="bg-accent/10 rounded-full p-3">
            <Ionicons name="wallet-outline" size={24} color="#7c3aed" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-secondary">
              Request Payment
            </Text>
            <Text className="text-sm text-gray-500">
              Withdraw funds from your wallet
            </Text>
          </View>
        </View>

        <View className="bg-linear-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-4 mb-6">
          <Text className="text-xs text-gray-600 font-medium mb-1">
            Available Balance
          </Text>
          {isWalletLoading ? (
            <Skeleton className="w-32 h-8 rounded-lg" />
          ) : (
            <Text className="text-3xl font-bold text-secondary">
              {AppConfig.currency.symbol} {formatCurrency(balance)}
            </Text>
          )}
        </View>

        <View className="gap-5">
          <View>
            <Text className="text-sm font-medium text-secondary mb-2">
              Amount *
            </Text>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <FormField
                  control={control}
                  name="amount"
                  placeholder="Enter amount"
                  keyboardType="numeric"
                />
              </View>
              <Button
                size="sm"
                variant="ghost"
                onPress={handleWithdrawAll}
                isDisabled={isSubmitting}
                className="mt-1 border border-accent"
              >
                <Text className="font-medium text-accent">All</Text>
              </Button>
            </View>
          </View>

          <SelectField
            control={control}
            name="payoutMethod"
            label="Payout Method *"
            placeholder="Select payout method"
            options={[
              { label: "Mobile Money", value: PayoutMethod.MOBILE_MONEY },
              { label: "Bank Transfer", value: PayoutMethod.BANK_TRANSFER },
            ]}
          />

          {payoutMethod === PayoutMethod.MOBILE_MONEY && (
            <>
              <MobileMoneyField control={control} isVerifying={isVerifying} />

              {verifiedAccountName && (
                <Alert
                  variant="success"
                  title="Account Verified Successfully!"
                  message={`Account Name: ${verifiedAccountName}`}
                />
              )}

              {verificationError && (
                <Alert
                  variant="error"
                  title="Verification Failed"
                  message={verificationError}
                />
              )}
            </>
          )}

          {payoutMethod === PayoutMethod.BANK_TRANSFER && (
            <BankTransferFields control={control} />
          )}

          <FormField
            control={control}
            name="notes"
            label="Notes (Optional)"
            placeholder="Add any additional notes"
            multiline
            numberOfLines={3}
          />

          {error && <Alert variant="error" message={error} />}

          <View className="flex-row gap-3 mt-4 pb-6">
            <Button
              size="lg"
              variant="ghost"
              onPress={() => router.back()}
              isDisabled={isSubmitting}
              className="flex-1 border border-gray-300"
            >
              <Text className="font-medium text-secondary">Cancel</Text>
            </Button>
            <Button
              size="lg"
              onPress={handleSubmit(onSubmit)}
              isDisabled={
                isSubmitting ||
                amount <= 0 ||
                amount > balance ||
                (payoutMethod === PayoutMethod.MOBILE_MONEY &&
                  !verifiedAccountName)
              }
              className="flex-1"
            >
              {isSubmitting ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-medium">Processing...</Text>
                </View>
              ) : (
                <Text className="text-white font-medium">Submit Request</Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
