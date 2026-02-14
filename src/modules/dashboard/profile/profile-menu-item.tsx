import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Pressable, Text, View } from "react-native";

interface ProfileMenuItemProps {
  icon: Parameters<typeof IconSymbol>[0]["name"];
  title: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}

export function ProfileMenuItem(props: ProfileMenuItemProps) {
  const {
    icon,
    title,
    subtitle,
    onPress,
    disabled = false,
    variant = "default",
  } = props;

  const iconColor = useThemeColor({}, "icon");
  const dangerColor = "#EF4444";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`py-4 px-4 border-b border-black/10 dark:border-white/10 ${
        disabled ? "opacity-50" : "active:opacity-70"
      }`}
    >
      <View className="flex-row items-center gap-4">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${
            variant === "danger"
              ? "bg-red-500/15"
              : "bg-black/5 dark:bg-white/5"
          }`}
        >
          <IconSymbol
            name={icon}
            size={22}
            color={variant === "danger" ? dangerColor : iconColor}
          />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className={`text-base leading-6 font-semibold mb-0.5 ${
                variant === "danger" ? "text-red-500" : "text-secondary"
              }`}
            >
              {title}
            </Text>
            {disabled && (
              <View className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] font-semibold opacity-70 text-secondary">
                  Coming Soon
                </Text>
              </View>
            )}
          </View>
          {subtitle && (
            <Text className="text-[13px] leading-5 opacity-60 text-secondary">
              {subtitle}
            </Text>
          )}
        </View>
        {!disabled && (
          <IconSymbol
            name="chevron.right"
            size={20}
            color={iconColor}
            style={{ opacity: 0.5 }}
          />
        )}
      </View>
    </Pressable>
  );
}
