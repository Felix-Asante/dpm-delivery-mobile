import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ProfileMenuItem } from "@/modules/dashboard/profile/profile-menu-item";
import type { User } from "@/types/auth.types";
import { getInitials } from "@/utils/common";
import { Storage, StorageKeys } from "@/utils/storage";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

export default function Profile() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const accentColor = useThemeColor({}, "tint");

  const user = useMemo(() => {
    return Storage.getObject(StorageKeys.USER) as User | null;
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await Storage.deleteToken(StorageKeys.AUTH_TOKEN);
              await Storage.deleteToken(StorageKeys.REFRESH_TOKEN);
              Storage.removeItem(StorageKeys.USER);

              router.replace("/(public)/(auth)/sign-in");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View className="flex-1 bg-background pt-safe">
      <ScrollView showsVerticalScrollIndicator={false} className="pb-8">
        {/* Header Section */}
        <View className="items-center pt-8 pb-6 px-5">
          <View className="relative mb-4">
            {user?.profilePicture ? (
              <View className="w-[100px] h-[100px] rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center overflow-hidden">
                <Text className="text-4xl font-bold text-white">
                  {getInitials(user.fullName)}
                </Text>
              </View>
            ) : (
              <View
                className="w-[100px] h-[100px] rounded-full items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <Text className="text-4xl font-bold text-white">
                  {getInitials(user?.fullName || "U")}
                </Text>
              </View>
            )}
            {user?.isVerified && (
              <View className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-xl p-1 border-2 border-white dark:border-gray-800">
                <IconSymbol
                  name="checkmark.seal.fill"
                  size={16}
                  color="#10B981"
                />
              </View>
            )}
          </View>

          <Text className="text-[32px] font-bold leading-8 mb-3 text-center text-secondary">
            {user?.fullName || "User"}
          </Text>

          {user?.phone && (
            <View className="flex-row items-center gap-2 mb-2">
              <IconSymbol
                name="phone.fill"
                size={16}
                color={Colors[colorScheme ?? "light"].icon}
              />
              <Text className="text-sm leading-5 opacity-70 text-secondary">
                {user.phone}
              </Text>
            </View>
          )}

          {user?.email && (
            <View className="flex-row items-center gap-2 mb-2">
              <IconSymbol
                name="envelope.fill"
                size={16}
                color={Colors[colorScheme ?? "light"].icon}
              />
              <Text className="text-sm leading-5 opacity-70 text-secondary">
                {user.email}
              </Text>
            </View>
          )}

          {user?.address && (
            <View className="flex-row items-center gap-2 mb-2">
              <IconSymbol
                name="location.fill"
                size={16}
                color={Colors[colorScheme ?? "light"].icon}
              />
              <Text className="text-sm leading-5 opacity-70 text-secondary">
                {user.address}
              </Text>
            </View>
          )}
        </View>

        <View className="mt-2 px-5">
          <Text className="text-xl font-bold mb-3 mt-2 opacity-80 text-secondary">
            Account
          </Text>
          <View className="bg-transparent rounded-xl overflow-hidden mb-2">
            <ProfileMenuItem
              icon="pencil"
              title="Edit Profile"
              subtitle="Update your personal information"
              disabled={true}
            />
            <ProfileMenuItem
              icon="lock.fill"
              title="Change Password"
              subtitle="Update your password"
              disabled={true}
            />
          </View>
        </View>

        <View className="mt-2 px-5">
          <Text className="text-xl font-bold mb-3 mt-2 opacity-80 text-secondary">
            Settings
          </Text>
          <View className="bg-transparent rounded-xl overflow-hidden mb-2">
            <ProfileMenuItem
              icon="gearshape.fill"
              title="App Settings"
              subtitle="Notifications, preferences, and more"
              disabled={true}
            />
            <ProfileMenuItem
              icon="phone.fill"
              title="Contact Support"
              subtitle="Get help from our support team"
              disabled={true}
            />
          </View>
        </View>

        <View className="px-5 mt-6">
          <Pressable
            onPress={handleLogout}
            className="flex-row items-center justify-center gap-2 py-3.5 rounded-xl bg-red-500 active:opacity-80"
          >
            <IconSymbol
              name="rectangle.portrait.and.arrow.right"
              size={20}
              color="#FFFFFF"
            />
            <Text className="text-white text-base leading-6 font-semibold">
              Logout
            </Text>
          </Pressable>
        </View>

        <View className="items-center mt-8 px-5">
          <Text className="text-xs leading-4 opacity-50 text-secondary">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
