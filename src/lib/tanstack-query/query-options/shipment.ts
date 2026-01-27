import { api } from "@/services/api";
import type { Query } from "@/types";
import { queryKeys } from "../query-keys";

export const getShipmentsQueryOptions = (query: Query) => ({
  queryKey: queryKeys.shipments.list(query),
  queryFn: () => api.shipments.list(query),
  refetchOnWindowFocus: false,
});
