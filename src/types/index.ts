import type { AxiosApiResponse } from "@/services/http.service";

export type ApiResponse<T> = Promise<AxiosApiResponse<T>>;

export type Query = Record<string, string | number | boolean | undefined>;
