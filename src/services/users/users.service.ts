import { apiEndPoints } from "../api/end-points";
import type { HttpClient } from "../http.service";

export function createUserService(httpClient: HttpClient) {
  return {
    getWallet: () => httpClient.get(apiEndPoints.users.wallet()),
  };
}
