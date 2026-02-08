import type { ApiResponse } from "@/types";
import type { VerifyMobileMoneyResponse } from "@/types/payout.types";

/**
 * Verify mobile money account using Paystack API
 * This is a placeholder implementation that should be replaced with actual API integration
 */
export async function verifyMobileMoneyAccount(
  accountNumber: string,
  provider: string,
): Promise<ApiResponse<VerifyMobileMoneyResponse>> {
  try {
    // TODO: Implement actual Paystack API integration
    // For now, simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Clean the phone number
    const cleanedNumber = accountNumber.replace(/[\s-]/g, "");

    // Validate phone number format
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(cleanedNumber)) {
      throw new Error("Invalid phone number format");
    }

    // Simulate a successful verification
    // In production, this would make an actual API call to Paystack
    const response: VerifyMobileMoneyResponse = {
      accountName: `Verified Account ${cleanedNumber.slice(-4)}`,
    };

    return {
      data: response,
      message: "Account verified successfully",
      status: 200,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to verify mobile money account",
    );
  }
}
