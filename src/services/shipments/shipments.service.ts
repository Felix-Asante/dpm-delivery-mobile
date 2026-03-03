import { Query } from "@/types";
import { apiEndPoints } from "../api/end-points";
import type { HttpClient } from "../http.service";
import type { ShipmentService } from "./interface";

export function createShipmentService(httpClient: HttpClient): ShipmentService {
  return {
    getRiderLatestOrders: (riderId: string) =>
      httpClient.get(apiEndPoints.shipments.getRiderLatestOrders(riderId)),
    getByReference: (reference: string) =>
      httpClient.get(apiEndPoints.shipments.getByReference(reference)),
    updateStatus: (shipmentId: string, data: FormData) =>
      httpClient.patch(apiEndPoints.shipments.update_status(shipmentId), data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    list: (query: Query) => httpClient.get(apiEndPoints.shipments.list(query)),
  };
}
