import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View className="p-safe mx-5">
      <Text className="text-primary font-bold text-2xl">Home</Text>
      <Button
        variant="primary"
        onPress={() => router.push("/(public)/(auth)/sign-in")}
      >
        Button secondary
      </Button>
    </View>
  );
}
