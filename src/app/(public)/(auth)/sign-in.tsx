import { LoginForm } from "@/modules/auth/login-form";
import LottieView from "lottie-react-native";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function SignInScreen() {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      bottomOffset={60}
    >
      <View className="bg-accent h-full flex-1">
        <View className="absolute top-0 left-0 h-full w-full bg-black/20" />
        <LottieView
          source={require("../../../assets/animations/delivery-rider-animation.json")}
          style={{ width: "100%", height: "45%" }}
          autoPlay
          loop
        />
        <View className="bg-white rounded-3xl p-5 pt-8 flex-1">
          <Text className="text-primary font-medium text-2xl">
            Welcome back 👋
          </Text>
          <Text className="text-muted text-sm font-medium">
            Enter your details to get back on the road
          </Text>
          <View className="mt-6">
            <LoginForm />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
