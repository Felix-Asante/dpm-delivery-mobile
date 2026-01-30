import { ShipmentStatus } from "@/types/enums/shipment.enum";
import { z } from "zod";

export const updateShipmentStatusSchema = z
  .object({
    status: z.string("Status is required"),
    reason: z.string().optional(),
    confirmationCode: z
      .string()
      .min(4, "Confirmation code must be 4 digits")
      .max(4, "Confirmation code must be 4 digits")
      .optional(),
    photo: z.any().optional(),
    paid: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.status === ShipmentStatus.FAILED_DELIVERY_ATTEMPT &&
      !data.reason
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Reason is required",
        path: ["reason"],
      });
    }

    if (data.status === ShipmentStatus.DELIVERED && !data.confirmationCode) {
      ctx.addIssue({
        code: "custom",
        message: "Confirmation code is required",
        path: ["confirmationCode"],
      });
    }
    if (data.status === ShipmentStatus.PICKUP_CONFIRMED && !data.photo) {
      ctx.addIssue({
        code: "custom",
        message: "Photo is required",
        path: ["photo"],
      });
    }
  });

export type UpdateShipmentStatusField = z.infer<
  typeof updateShipmentStatusSchema
>;
