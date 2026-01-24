import { Logger } from "@/lib/logger";
import type { ApiError } from "@/services/http.service";

const logger = new Logger("ErrorUtils");

export const getErrorMessage = (
  error: any,
  defaultMessage: string = "Something went wrong",
): string => {
  const categorized = categorizeError(error);
  return categorized.userMessage || defaultMessage;
};

export enum ErrorCategory {
  NETWORK = "network",
  VALIDATION = "validation",
  BUSINESS = "business",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  SERVER = "server",
  NOT_FOUND = "not_found",
  RATE_LIMIT = "rate_limit",
  UNKNOWN = "unknown",
}

// Error severity levels for monitoring/Logging
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Categorized error information
export interface CategorizedError {
  category: ErrorCategory;
  severity: ErrorSeverity;
  userMessage: string;
  technicalMessage: string;
  actionable: {
    canRetry: boolean;
    suggestedAction?: string;
    actionLabel?: string;
  };
  metadata: {
    statusCode?: number;
    originalError: unknown;
    timestamp: string;
  };
}

// Categorize and enrich an error with context
export function categorizeError(error: unknown): CategorizedError {
  const timestamp = new Date().toISOString();
  const apiError = error as ApiError;

  // Handle prescription API errors (business errors from response.data)
  const prescriptionError = error as any;
  if (
    prescriptionError &&
    typeof prescriptionError === "object" &&
    "code" in prescriptionError &&
    "message" in prescriptionError &&
    !prescriptionError.isApiError
  ) {
    return {
      category: ErrorCategory.BUSINESS,
      severity: ErrorSeverity.MEDIUM,
      userMessage:
        prescriptionError.message || "Une erreur métier s'est produite.",
      technicalMessage: `Business error [${prescriptionError.code}]: ${prescriptionError.message}`,
      actionable: {
        canRetry: false,
        suggestedAction: "Vérifiez les informations et réessayez",
      },
      metadata: {
        statusCode: undefined,
        originalError: error,
        timestamp,
      },
    };
  }

  if (apiError.isApiError && !apiError.status) {
    return {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.HIGH,
      userMessage:
        apiError.message ||
        "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
      technicalMessage: apiError.message || "Network connection failed",
      actionable: {
        canRetry: true,
        suggestedAction: "Vérifiez votre connexion WiFi ou données mobiles",
        actionLabel: "Réessayer",
      },
      metadata: {
        originalError: error,
        timestamp,
      },
    };
  }

  // Handle errors by status code
  if (apiError.isApiError && apiError.status) {
    switch (apiError.status) {
      case 400:
        return {
          category: ErrorCategory.VALIDATION,
          severity: ErrorSeverity.MEDIUM,
          userMessage:
            apiError.message ||
            "Les informations fournies sont invalides. Veuillez vérifier vos données.",
          technicalMessage: apiError.message || "Bad request",
          actionable: {
            canRetry: false,
            suggestedAction: "Vérifiez les champs du formulaire",
          },
          metadata: {
            statusCode: 400,
            originalError: error,
            timestamp,
          },
        };

      case 401:
        return {
          category: ErrorCategory.AUTHENTICATION,
          severity: ErrorSeverity.HIGH,
          userMessage:
            apiError.message ||
            "Votre session a expiré. Veuillez vous reconnecter.",
          technicalMessage: apiError.message || "Unauthorized",
          actionable: {
            canRetry: false,
            suggestedAction: "Reconnectez-vous à votre compte",
            actionLabel: "Se reconnecter",
          },
          metadata: {
            statusCode: 401,
            originalError: error,
            timestamp,
          },
        };

      case 403:
        return {
          category: ErrorCategory.AUTHORIZATION,
          severity: ErrorSeverity.HIGH,
          userMessage:
            apiError.message ||
            "Vous n'avez pas les permissions nécessaires pour cette action.",
          technicalMessage: apiError.message || "Forbidden",
          actionable: {
            canRetry: false,
            suggestedAction:
              "Contactez votre administrateur pour obtenir les droits d'accès",
          },
          metadata: {
            statusCode: 403,
            originalError: error,
            timestamp,
          },
        };

      case 404:
        return {
          category: ErrorCategory.NOT_FOUND,
          severity: ErrorSeverity.MEDIUM,
          userMessage:
            apiError.message ||
            "La ressource demandée n'existe pas ou a été supprimée.",
          technicalMessage: apiError.message || "Resource not found",
          actionable: {
            canRetry: false,
            suggestedAction: "Vérifiez que l'élément existe toujours",
          },
          metadata: {
            statusCode: 404,
            originalError: error,
            timestamp,
          },
        };

      // Business validation errors
      case 422:
        return {
          category: ErrorCategory.BUSINESS,
          severity: ErrorSeverity.MEDIUM,
          userMessage:
            apiError.message ||
            "Les données ne respectent pas les règles métier.",
          technicalMessage: apiError.message || "Unprocessable entity",
          actionable: {
            canRetry: false,
            suggestedAction: "Corrigez les erreurs indiquées",
          },
          metadata: {
            statusCode: 422,
            originalError: error,
            timestamp,
          },
        };

      case 429:
        return {
          category: ErrorCategory.RATE_LIMIT,
          severity: ErrorSeverity.MEDIUM,
          userMessage:
            "Trop de requêtes effectuées. Veuillez patienter quelques instants.",
          technicalMessage: apiError.message || "Rate limit exceeded",
          actionable: {
            canRetry: true,
            suggestedAction: "Attendez quelques secondes avant de réessayer",
            actionLabel: "Réessayer",
          },
          metadata: {
            statusCode: 429,
            originalError: error,
            timestamp,
          },
        };

      // Server errors
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          category: ErrorCategory.SERVER,
          severity: ErrorSeverity.CRITICAL,
          userMessage:
            apiError.message ||
            "Le serveur rencontre un problème temporaire. Veuillez réessayer dans quelques instants.",
          technicalMessage:
            apiError.message || `Server error: ${apiError.status}`,
          actionable: {
            canRetry: true,
            suggestedAction:
              "Patientez quelques minutes puis réessayez votre action",
            actionLabel: "Réessayer",
          },
          metadata: {
            statusCode: apiError.status,
            originalError: error,
            timestamp,
          },
        };

      // Unknown errors
      default:
        return {
          category: ErrorCategory.UNKNOWN,
          severity: ErrorSeverity.MEDIUM,
          userMessage:
            apiError.message || "Une erreur inattendue s'est produite.",
          technicalMessage: `HTTP ${apiError.status}: ${apiError.message}`,
          actionable: {
            canRetry: true,
            suggestedAction: "Réessayez votre action",
            actionLabel: "Réessayer",
          },
          metadata: {
            statusCode: apiError.status,
            originalError: error,
            timestamp,
          },
        };
    }
  }

  // Unknown errors
  return {
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    userMessage: "Une erreur inattendue s'est produite.",
    technicalMessage: error instanceof Error ? error.message : String(error),
    actionable: {
      canRetry: true,
      suggestedAction: "Réessayez votre action",
      actionLabel: "Réessayer",
    },
    metadata: {
      originalError: error,
      timestamp,
    },
  };
}

// Handle error with proper categorization, logging, and monitoring
export function handleError(
  error: unknown,
  context?: {
    operation?: string;
    componentName?: string;
    userId?: string;
    correlationId?: string;
    additionalData?: Record<string, any>;
  },
): CategorizedError {
  const categorized = categorizeError(error);

  // structured logging with full context
  const logLevel =
    categorized.severity === ErrorSeverity.CRITICAL ||
    categorized.severity === ErrorSeverity.HIGH
      ? "error"
      : "warning";

  if (logLevel === "error") {
    logger.error(
      categorized.userMessage,
      error instanceof Error ? error : undefined,
      {
        component: context?.componentName,
        operation: context?.operation,
        correlationId: context?.correlationId,
        metadata: {
          category: categorized.category,
          severity: categorized.severity,
          statusCode: categorized.metadata.statusCode,
          technicalMessage: categorized.technicalMessage,
          canRetry: categorized.actionable.canRetry,
          suggestedAction: categorized.actionable.suggestedAction,
          ...context?.additionalData,
        },
        audit: {
          action: context?.operation,
          result: "failure",
        },
      },
    );
  } else {
    logger.warning(categorized.userMessage, {
      component: context?.componentName,
      operation: context?.operation,
      metadata: {
        category: categorized.category,
        severity: categorized.severity,
        ...context?.additionalData,
      },
    });
  }

  return categorized;
}
export function getUserMessage(error: unknown): string {
  return categorizeError(error).userMessage;
}

export function shouldShowRetry(error: unknown): boolean {
  return categorizeError(error).actionable.canRetry;
}

export function getSuggestedAction(error: unknown): string | undefined {
  return categorizeError(error).actionable.suggestedAction;
}
