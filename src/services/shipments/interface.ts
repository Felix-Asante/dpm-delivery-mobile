import type { ApiResponse, Query } from "@/types";
import type { GetShipmentsResponse } from "@/types/shipment.types";

export interface ShipmentService {
  list(query: Query): ApiResponse<GetShipmentsResponse>;
}
