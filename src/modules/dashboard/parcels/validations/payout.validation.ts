import { PayoutMethod } from "@/types/enums/payout-enums";
import { z } from "zod";

export const payoutRequestSchema = z
  .object({
    amount: z.coerce
      .number({
        message: "Amount is required",
      })
      .min(10, "Minimum amount is 10"),
    payoutMethod: z.enum(Object.values(PayoutMethod), {
      message: "Payout method is required",
    }),
    // Mobile Money fields
    mobileMoneyProvider: z.string().optional(),
    mobileMoneyNumber: z.string().optional(),
    mobileMoneyAccountName: z.string().optional(),
    // Bank Transfer fields
    accountNumber: z.string().optional(),
    accountName: z.string().optional(),
    bankName: z.string().optional(),
    bankCode: z.string().optional(),
    // Optional notes
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate Mobile Money fields
    if (data.payoutMethod === PayoutMethod.MOBILE_MONEY) {
      if (!data.mobileMoneyProvider || data.mobileMoneyProvider.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Mobile money provider is required",
          path: ["mobileMoneyProvider"],
        });
      }
      if (!data.mobileMoneyNumber || data.mobileMoneyNumber.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Mobile money number is required",
          path: ["mobileMoneyNumber"],
        });
      } else {
        // Validate phone number format
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(data.mobileMoneyNumber.replace(/[\s-]/g, ""))) {
          ctx.addIssue({
            code: "custom",
            message: "Please enter a valid phone number (10-15 digits)",
            path: ["mobileMoneyNumber"],
          });
        }
      }
      if (
        !data.mobileMoneyAccountName ||
        data.mobileMoneyAccountName.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Mobile money account name is required",
          path: ["mobileMoneyAccountName"],
        });
      }
    }

    // Validate Bank Transfer fields
    if (data.payoutMethod === PayoutMethod.BANK_TRANSFER) {
      if (!data.accountNumber || data.accountNumber.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Account number is required",
          path: ["accountNumber"],
        });
      }
      if (!data.accountName || data.accountName.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Account name is required",
          path: ["accountName"],
        });
      }
      if (!data.bankName || data.bankName.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Bank name is required",
          path: ["bankName"],
        });
      }
    }
  });

export type PayoutRequestFormData = z.infer<typeof payoutRequestSchema>;
