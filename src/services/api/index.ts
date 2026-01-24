import { createAuthService } from "../auth/auth.service";
import type { AuthService } from "../auth/interface";
import type { HttpClient } from "../http.service";
import { createHttpClient } from "../http.service";
import { apiEndPoints } from "./end-points";

class ApiService {
  private readonly http: HttpClient;

  auth: AuthService;

  constructor(onTokenRefreshFailed?: () => void) {
    this.http = createHttpClient({
      baseURL: apiEndPoints.baseUrl,
      onTokenRefreshFailed,
    });

    this.auth = createAuthService(this.http);
  }
}

export const api = new ApiService();
