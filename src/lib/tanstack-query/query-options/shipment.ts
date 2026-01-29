import { api } from "@/services/api";
import type { Query } from "@/types";
import { queryKeys } from "../query-keys";

export const getShipmentsQueryOptions = (query: Query) => ({
  queryKey: queryKeys.shipments.list(query),
  queryFn: () => api.shipments.list(query),
  refetchOnWindowFocus: false,
});

export const getShipmentByReferenceQueryOptions = (reference: string) => ({
  queryKey: queryKeys.shipments.getByReference(reference),
  queryFn: () => api.shipments.getByReference(reference),
  refetchOnWindowFocus: false,
  staleTime: 5 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
});
