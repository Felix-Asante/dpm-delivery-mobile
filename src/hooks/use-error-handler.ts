import type { CategorizedError } from "@/utils/errors";
import { handleError as handleErrorUtil } from "@/utils/errors";
import { useToast } from "heroui-native";
import { useCallback } from "react";

interface ErrorHandlerOptions {
  operation?: string;
  componentName?: string;
  showToast?: boolean;
  onError?: (categorized: CategorizedError) => void;
}

export function useErrorHandler(componentName: string) {
  const { toast } = useToast();
  // TODO: add user id

  const handleError = useCallback(
    (error: unknown, options?: ErrorHandlerOptions) => {
      const categorized = handleErrorUtil(error, {
        operation: options?.operation,
        componentName: options?.componentName || componentName,
        additionalData: {},
      });

      if (options?.showToast !== false) {
        toast.show({
          label: "Error",
          description: categorized.userMessage,
          variant: "danger",
        });
      }

      if (options?.onError) {
        options.onError(categorized);
      }

      return categorized;
    },
    [componentName],
  );

  return { handleError };
}
