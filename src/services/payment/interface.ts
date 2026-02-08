import { ApiResponse } from "@/types";
import { VerifyMobileMoneyResponse } from "@/types/payout.types";

export interface IPaymentService {
  verifyMobileMoneyNumber: (
    accountNumber: string,
    provider: string,
  ) => ApiResponse<VerifyMobileMoneyResponse>;
}
