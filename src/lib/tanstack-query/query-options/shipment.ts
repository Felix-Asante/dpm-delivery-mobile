import { api } from "@/services/api";
import { queryKeys } from "../query-keys";

export const getShipmentsQueryOptions = (riderId: string) => ({
  queryKey: queryKeys.shipments.getRiderLatestOrders(riderId),
  queryFn: () => api.shipments.getRiderLatestOrders(riderId),
});

export const getShipmentByReferenceQueryOptions = (reference: string) => ({
  queryKey: queryKeys.shipments.getByReference(reference),
  queryFn: () => api.shipments.getByReference(reference),
});
