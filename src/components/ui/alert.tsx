import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
}

const alertStyles = {
  success: {
    container: "bg-green-50 border-green-200",
    icon: "checkmark-circle" as const,
    iconColor: "#10b981",
    titleColor: "text-green-900",
    messageColor: "text-green-700",
  },
  error: {
    container: "bg-red-50 border-red-200",
    icon: "alert-circle" as const,
    iconColor: "#ef4444",
    titleColor: "text-red-900",
    messageColor: "text-red-700",
  },
  warning: {
    container: "bg-orange-50 border-orange-200",
    icon: "warning" as const,
    iconColor: "#f97316",
    titleColor: "text-orange-900",
    messageColor: "text-orange-700",
  },
  info: {
    container: "bg-blue-50 border-blue-200",
    icon: "information-circle" as const,
    iconColor: "#3b82f6",
    titleColor: "text-blue-900",
    messageColor: "text-blue-700",
  },
};

export function Alert({ variant, title, message, icon }: AlertProps) {
  const styles = alertStyles[variant];
  const displayIcon = icon || styles.icon;

  return (
    <View className={`border rounded-lg p-4 ${styles.container}`}>
      <View className="flex-row items-start gap-3">
        <Ionicons name={displayIcon} size={20} color={styles.iconColor} />
        <View className="flex-1">
          {title ? (
            <Text className={`text-sm font-medium mb-1 ${styles.titleColor}`}>
              {title}
            </Text>
          ) : null}
          <Text className={`text-sm ${styles.messageColor}`}>{message}</Text>
        </View>
      </View>
    </View>
  );
}
