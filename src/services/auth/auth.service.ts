import { apiEndPoints } from "../api/end-points";
import type { HttpClient } from "../http.service";
import type { AuthService } from "./interface";

export function createAuthService(httpClient: HttpClient): AuthService {
  return {
    login: (data) => httpClient.post(apiEndPoints.auth.login(), data),
  };
}
