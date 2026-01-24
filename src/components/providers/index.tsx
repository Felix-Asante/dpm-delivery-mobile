import { type HeroUINativeConfig, HeroUINativeProvider } from "heroui-native";

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
    <HeroUINativeProvider config={config}>{children}</HeroUINativeProvider>
  );
}
