import { Providers } from "@/components/providers";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Appearance } from "react-native";
import "../global.css";

export const unstable_settings = {
  anchor: "(public)/auth/sign-in",
  initialRouteName: "(public)/auth/sign-in",
};

Appearance.setColorScheme("light");

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Providers>
        <Stack>
          <Stack.Screen name="(public)" options={{ headerShown: false }} />
          <Stack.Screen name="(parcel)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </Providers>
    </ThemeProvider>
  );
}
