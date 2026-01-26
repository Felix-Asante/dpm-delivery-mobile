import type { ApiResponse } from "@/types";
import type { Wallet } from "@/types/wallet.types";

export interface IUserService {
  getWallet: () => ApiResponse<Wallet>;
}
