import { getErrorMessage } from "@/utils/errors";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";

import { Logger } from "@/lib/logger";
import { Storage, StorageKeys } from "@/utils/storage";

export interface AxiosApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
  isApiError: boolean;
  code?: string;
}

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  onTokenRefreshFailed?: () => void;
}

const DEFAULT_TIMEOUT = 30000;

const logger = new Logger("HttpClient");

export class HttpClient {
  private instance: AxiosInstance;
  private onTokenRefreshFailed?: () => void;

  constructor(config: HttpClientConfig) {
    this.onTokenRefreshFailed = config.onTokenRefreshFailed;
    this.instance = axios.create({
      timeout: config.timeout || DEFAULT_TIMEOUT,
      baseURL: config.baseURL,
      headers: {
        "Content-Type": "application/json",
        ...(config.headers || {}),
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      async (config) => {
        // fetch fresh auth token on each request
        const authToken = await Storage.getToken(StorageKeys.AUTH_TOKEN);

        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      (error: Error) => Promise.reject(error),
    );

    // Response interceptor - transform response and handle errors
    this.instance.interceptors.response.use(
      (response) => ({
        ...this.handleResponse(response),
        config: response.config,
        headers: response.headers,
      }),
      this.handleError.bind(this),
    );
  }

  private handleResponse(response: AxiosResponse): AxiosApiResponse {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  private handleError = async (error: AxiosError): Promise<never> => {
    console.error("HTTP Client Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code,
      requestHeaders: error.config?.headers,
      responseHeaders: error.response?.headers,
      responseData: error.response?.data,
      timestamp: new Date().toISOString(),
    });

    const apiError: ApiError = {
      message: "Une erreur inattendue s'est produite",
      isApiError: true,
    };

    const errorResponse = error.response as any;
    const errorMessage = errorResponse?.data?.message || error.message;

    if (error.response) {
      apiError.status = error.response.status;
      apiError.data = error.response.data;

      switch (error.response.status) {
        case 401:
          // case 403:
          // Try token refresh before giving up
          if (await this.attemptTokenRefresh()) {
            // Retry the original request
            return this.instance.request(error.config!);
          }
          apiError.message =
            errorMessage || "Non autorisé: Veuillez vous reconnecter";
          break;

        case 404:
          apiError.message = errorMessage || "Ressource non trouvée";
          break;

        case 422:
          apiError.message =
            errorMessage ||
            getErrorMessage(error.response.data) ||
            "Erreur de validation";
          break;

        case 429: {
          // Rate limiting - suggest retry after delay
          const retryAfter = error.response.headers["retry-after"] || "60";
          apiError.message = `Trop de requêtes. Réessayez dans ${retryAfter} secondes.`;
          break;
        }

        case 500:
        case 502:
        case 503:
        case 504:
          apiError.message =
            errorMessage || "Erreur serveur: Veuillez réessayer plus tard";
          break;

        default:
          apiError.message =
            errorMessage ||
            `Requête échouée avec le statut ${error.response.status}`;
      }
    } else if (error.request) {
      // Network error
      if (error.code === "NETWORK_ERROR") {
        apiError.message =
          "Erreur de connexion: Vérifiez votre connexion internet";
      } else if (error.code === "ECONNABORTED") {
        apiError.message = "Délai d'attente dépassé: Veuillez réessayer";
      } else {
        apiError.message = "Erreur réseau: Veuillez réessayer plus tard";
      }
    } else {
      apiError.message =
        error.message || "Erreur de configuration de la requête";
    }

    return Promise.reject(apiError);
  };

  private async attemptTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = await Storage.getToken(StorageKeys.REFRESH_TOKEN);

      if (!refreshToken) {
        console.warn("No refresh token available for token refresh");
        // this.handleTokenRefreshFailure();
        return false;
      }

      //   TODO: implement token refresh
      const response = {
        data: {
          access_token: "access_token",
          refresh_token: "refresh_token",
        },
      };

      const accessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;

      await Storage.setToken(StorageKeys.AUTH_TOKEN, accessToken);
      await Storage.setToken(StorageKeys.REFRESH_TOKEN, newRefreshToken);

      return true;
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      this.handleTokenRefreshFailure();
      return false;
    }
  }

  private async handleTokenRefreshFailure(): Promise<void> {
    Storage.deleteToken(StorageKeys.AUTH_TOKEN);
    Storage.deleteToken(StorageKeys.REFRESH_TOKEN);
    Storage.removeItem(StorageKeys.USER);

    if (this.onTokenRefreshFailed) {
      this.onTokenRefreshFailed();
    } else {
      logger.info("No logout callback provided to HttpClient");
    }
  }

  private async request<T = any>(
    config: AxiosRequestConfig,
  ): Promise<AxiosApiResponse<T>> {
    logger.info("API Request:", {
      component: "HttpClient",
      operation: "request",
      metadata: {
        url: config.url,
        method: config.method,
        data: config.data,
        params: config.params,
      },
    });
    return await this.instance.request(config);
  }

  public async get<T = any>(
    endpoint: string,
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosApiResponse<T>> {
    return this.request<T>({
      method: "GET",
      url: endpoint,
      params,
      ...config,
    });
  }

  public async post<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosApiResponse<T>> {
    return this.request<T>({
      method: "POST",
      url: endpoint,
      data,
      ...config,
    });
  }

  public async put<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosApiResponse<T>> {
    return this.request<T>({
      method: "PUT",
      url: endpoint,
      data,
      ...config,
    });
  }

  public async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosApiResponse<T>> {
    return this.request<T>({
      method: "PATCH",
      url: endpoint,
      data,
      ...config,
    });
  }

  public async delete<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url: endpoint,
      ...config,
    });
  }
}

export const createHttpClient = (config: HttpClientConfig): HttpClient => {
  return new HttpClient(config);
};
