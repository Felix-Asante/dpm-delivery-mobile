import type { ApiResponse, Query } from "@/types";
import type { GetShipmentsResponse, Shipment } from "@/types/shipment.types";

export interface ShipmentService {
  list(query: Query): ApiResponse<GetShipmentsResponse>;
  getByReference(reference: string): ApiResponse<Shipment>;
}
