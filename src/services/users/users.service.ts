import { apiEndPoints } from "../api/end-points";
import type { HttpClient } from "../http.service";
import type { IUserService } from "./interface";

export function createUserService(httpClient: HttpClient): IUserService {
  return {
    getWallet: () => httpClient.get(apiEndPoints.users.wallet()),
    riders: {
      stats: (riderId: string) =>
        httpClient.get(apiEndPoints.riders.stats(riderId)),
    },
    transactions: (query) =>
      httpClient.get(apiEndPoints.users.transactions(query)),
    createPayoutRequest: (data) =>
      httpClient.post(apiEndPoints.users.payout_request(), data),
  };
}
