import { apiEndPoints } from "../api/end-points";
import { HttpClient } from "../http.service";
import { IPaymentService } from "./interface";

export function createPaymentService(httpClient: HttpClient): IPaymentService {
  return {
    verifyMobileMoneyNumber: async (accountNumber, provider) => {
      return httpClient.post(apiEndPoints.payment.verifyMobileMoneyNumber(), {
        accountNumber,
        provider,
      });
    },
  };
}
