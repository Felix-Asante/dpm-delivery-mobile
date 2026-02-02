import type { WalletTransactionTypes } from "./enums/index.enum";
import type { PaginationMeta } from "./index";

export type GetWalletTransactionsResponse = {
  meta: PaginationMeta;
  items: Transaction[];
};

export type Transaction = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  amount: string;
  type: WalletTransactionTypes;
  reference: string;
};
