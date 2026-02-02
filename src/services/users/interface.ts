import type { ApiResponse, Query } from "@/types";
import type { GetWalletTransactionsResponse } from "@/types/transactions.types";
import type { RiderStats } from "@/types/users.types";
import type { Wallet } from "@/types/wallet.types";

export interface IUserService {
  getWallet: () => ApiResponse<Wallet>;
  riders: {
    stats: (riderId: string) => ApiResponse<RiderStats>;
  };
  transactions: (query: Query) => ApiResponse<GetWalletTransactionsResponse>;
}
