import { api } from "@/services/api";
import { queryKeys } from "../query-keys";

export const getUserWalletQueryOptions = () => ({
  queryKey: queryKeys.users.wallet(),
  queryFn: api.users.getWallet,
  refetchOnWindowFocus: false,
  staleTime: 5 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
});
