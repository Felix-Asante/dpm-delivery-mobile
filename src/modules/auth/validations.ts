import { INPUT_REQUIRED_INVALID_ERROR } from "@/utils/validation";
import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string(INPUT_REQUIRED_INVALID_ERROR)
    .min(1, "Phone number is required"),
  password: z
    .string(INPUT_REQUIRED_INVALID_ERROR)
    .min(1, "Password is required"),
});

export type LoginSchemaInput = z.infer<typeof loginSchema>;
