import type { ApiResponse } from "@/types";
import type { RiderStats } from "@/types/users.types";
import type { Wallet } from "@/types/wallet.types";

export interface IUserService {
  getWallet: () => ApiResponse<Wallet>;
  riders: {
    stats: (riderId: string) => ApiResponse<RiderStats>;
  };
}
