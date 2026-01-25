import type { LoginSchemaInput } from "@/modules/auth/validations";
import type { ApiResponse } from "@/types";

export interface AuthService {
  login: (data: LoginSchemaInput) => ApiResponse<void>;
}
