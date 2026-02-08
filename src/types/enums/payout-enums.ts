export enum PayoutMethod {
  MOBILE_MONEY = "mobile_money",
  BANK_TRANSFER = "bank_transfer",
}

export enum PayoutRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  COMPLETED = "completed",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  FAILED = "failed",
}
