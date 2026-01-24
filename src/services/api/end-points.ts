import { ENV } from "@/utils/env";

const apiBaseUrl = ENV.apiBaseUrl;

const authEndPoints = {
  login: () => `/auth/login`,
};

export const apiEndPoints = {
  baseUrl: apiBaseUrl,
  auth: authEndPoints,
};
