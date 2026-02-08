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

export const shipmentEndPoints = {
  list: (query: Query) => `/shipping${toQueryParams(query)}`,
  get: (shipmentId: string) => `/shipping/${shipmentId}`,
  update_history: (shipmentId: string) =>
    `/shipping/${shipmentId}/update-history`,
  getByReference: (reference: string) => `/shipping/reference/${reference}`,
  update_status: (shipmentId: string) =>
    `/shipping/${shipmentId}/update-history`,
  transactions: (query: Query) =>
    `/users/wallet/transactions${toQueryParams(query)}`,
};

const paymentEndPoints = {
  verifyMobileMoneyNumber: () => `/payment/verify-mobile-money-account`,
};

export const apiEndPoints = {
  baseUrl: apiBaseUrl,
  auth: authEndPoints,
  riders: riderEndPoints,
  users: userEndPoints,
  payouts: payoutEndPoints,
  shipments: shipmentEndPoints,
  payment: paymentEndPoints,
};
