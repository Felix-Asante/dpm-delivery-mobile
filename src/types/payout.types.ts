import type { PayoutMethod, PayoutRequestStatus } from "./enums/payout-enums";

export interface CreatePayoutRequestDto {
  amount: number;
  payoutMethod: PayoutMethod;
  mobileMoneyProvider?: string;
  mobileMoneyNumber?: string;
  mobileMoneyAccountName?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  bankCode?: string;
  notes?: string;
}

export interface PayoutRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  amount: string;
  status: PayoutRequestStatus;
  payoutMethod: string;
  accountNumber?: string | null;
  accountName?: string | null;
  bankName?: string | null;
  bankCode?: string | null;
  mobileMoneyProvider?: string | null;
  mobileMoneyNumber?: string | null;
  mobileMoneyAccountName?: string | null;
  reference: string;
  notes?: string | null;
}

export interface VerifyMobileMoneyResponse {
  accountName: string;
}
