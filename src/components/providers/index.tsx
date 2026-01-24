import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type HeroUINativeConfig, HeroUINativeProvider } from "heroui-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

const config: HeroUINativeConfig = {
  textProps: {
    maxFontSizeMultiplier: 1.5,
  },
  devInfo: {
    stylingPrinciples: false,
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUINativeProvider config={config}>{children}</HeroUINativeProvider>
    </QueryClientProvider>
  );
}
