import { createAuthService } from "../auth/auth.service";
import type { AuthService } from "../auth/interface";
import type { HttpClient } from "../http.service";
import { createHttpClient } from "../http.service";
import type { IPaymentService } from "../payment/interface";
import { createPaymentService } from "../payment/payment.service";
import type { ShipmentService } from "../shipments/interface";
import { createShipmentService } from "../shipments/shipments.service";
import type { IUserService } from "../users/interface";
import { createUserService } from "../users/users.service";
import { apiEndPoints } from "./end-points";

class ApiService {
  private readonly http: HttpClient;

  auth: AuthService;
  users: IUserService;
  shipments: ShipmentService;
  payment: IPaymentService;

  constructor(onTokenRefreshFailed?: () => void) {
    this.http = createHttpClient({
      baseURL: apiEndPoints.baseUrl,
      onTokenRefreshFailed,
    });

    this.auth = createAuthService(this.http);
    this.users = createUserService(this.http);
    this.shipments = createShipmentService(this.http);
    this.payment = createPaymentService(this.http);
  }
}

export const api = new ApiService();
