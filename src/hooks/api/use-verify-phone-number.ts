import { api } from "@/services/api";
import { useCallback, useState } from "react";

export function useVerifyPhoneNumber() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(
    null,
  );

  const handleVerifyMobileNumber = useCallback(
    async (provider: string, number: string) => {
      if (!provider || !number) {
        setVerificationError("Please provide both provider and phone number");
        return;
      }

      setIsVerifying(true);
      setVerificationError(null);
      setVerifiedAccountName(null);
      try {
        const result = await api.payment.verifyMobileMoneyNumber(
          number,
          provider,
        );

        if (result.data?.accountName) {
          setVerifiedAccountName(result.data.accountName);
          setVerificationError(null);
        }
      } catch (err) {
        setVerificationError(
          err instanceof Error ? err.message : "Failed to verify account",
        );
        setVerifiedAccountName(null);
      } finally {
        setIsVerifying(false);
      }
    },
    [],
  );

  return {
    isVerifying,
    verificationError,
    verifiedAccountName,
    handleVerifyMobileNumber,
  };
}
