import { INPUT_REQUIRED_INVALID_ERROR } from "@/utils/validation";
import { validationRules } from "@/utils/validation-rules";
import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string(INPUT_REQUIRED_INVALID_ERROR)
    .min(1, "Phone number is required"),
  password: z
    .string(INPUT_REQUIRED_INVALID_ERROR)
    .min(1, "Password is required")
    .regex(validationRules.Password, "Invalid password"),
});

export type LoginSchemaInput = z.infer<typeof loginSchema>;
