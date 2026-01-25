import type { LoginSchemaInput } from "@/modules/auth/validations";
import type { ApiResponse } from "@/types";
import type { LoginResponse } from "@/types/auth.types";

export interface AuthService {
  login: (data: LoginSchemaInput) => ApiResponse<LoginResponse>;
}
