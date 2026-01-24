import { FormField } from "@/components/form-field";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "heroui-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

export function LoginForm() {
  const { control } = useForm();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View>
      <View className="gap-4 mb-5">
        <FormField
          control={control}
          name="email"
          label="Phone Number"
          placeholder="Enter your phone number"
          inputMode="tel"
          keyboardType="phone-pad"
          accessibilityLabel="Phone Number"
          accessibilityHint="Enter your phone number"
          accessibilityRole="text"
        />
        <FormField
          control={control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          inputMode="text"
          keyboardType="default"
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Password"
          accessibilityHint="Enter your password"
          accessibilityRole="text"
          suffix={
            <Ionicons
              color="gray"
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          }
        />
      </View>

      <Button variant="primary">Log In</Button>
      <Text className="text-center text-xs text-muted mt-2">
        Forgot Password? <Text className="text-accent">Reset</Text>
      </Text>
    </View>
  );
}
