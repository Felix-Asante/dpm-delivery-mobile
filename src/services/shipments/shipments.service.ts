import type { Query } from "@/types";
import { apiEndPoints } from "../api/end-points";
import type { HttpClient } from "../http.service";
import type { ShipmentService } from "./interface";

export function createShipmentService(httpClient: HttpClient): ShipmentService {
  return {
    list: (query: Query) => httpClient.get(apiEndPoints.shipments.list(query)),
    getByReference: (reference: string) =>
      httpClient.get(apiEndPoints.shipments.getByReference(reference)),
    updateStatus: (shipmentId: string, data: FormData) =>
      httpClient.patch(apiEndPoints.shipments.update_status(shipmentId), data),
  };
}
