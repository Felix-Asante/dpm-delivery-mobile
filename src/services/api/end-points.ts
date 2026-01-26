import type { Query } from "@/types";
import { toQueryParams } from "@/utils/common";
import { ENV } from "@/utils/env";

const apiBaseUrl = ENV.apiBaseUrl;

const authEndPoints = {
  login: () => `/auth/login`,
};

const riderEndPoints = {
  get: (riderId: string) => `/rider/${riderId}`,
  stats: (riderId: string) => `/rider/${riderId}/stats`,
};

const payoutEndPoints = {
  list: (query: Query) => `/wallets/payout-requests${toQueryParams(query)}`,
  update_status: (id: string) => `/wallets/payout-request/${id}/update-status`,
};

const userEndPoints = {
  get: (userId: string) => `/users/${userId}`,
  wallet: () => `/users/wallet`,
  transactions: (query: Query) =>
    `/users/wallet/transactions${toQueryParams(query)}`,
  payout_request: () => `/wallets/payout-request`,
};

export const apiEndPoints = {
  baseUrl: apiBaseUrl,
  auth: authEndPoints,
  riders: riderEndPoints,
  users: userEndPoints,
  payouts: payoutEndPoints,
};
