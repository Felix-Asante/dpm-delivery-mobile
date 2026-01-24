import type { ApiResponse } from "@/types";
import type { LoginRequestDto } from "@/types/auth.types";

export interface AuthService {
  login: (data: LoginRequestDto) => ApiResponse<void>;
}
