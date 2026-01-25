import { FormField } from "@/components/form-field";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { api } from "@/services/api";
import { Storage, StorageKeys } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Button, Spinner, useThemeColor } from "heroui-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { loginSchema, type LoginSchemaInput } from "./validations";

export function LoginForm() {
  const form = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { handleError } = useErrorHandler("LoginForm");
  const themeColorAccentForeground = useThemeColor("accent-foreground");
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: api.auth.login,
    retry: 1,
  });

  const onSubmit = async (data: LoginSchemaInput) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      Storage.setToken(StorageKeys.AUTH_TOKEN, response.data.accessToken);
      Storage.setObject(StorageKeys.USER, response.data.user);
      router.replace("/");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <View>
      <View className="gap-4 mb-5">
        <FormField
          control={form.control}
          name="phone"
          label="Phone Number"
          placeholder="Enter your phone number"
          inputMode="tel"
          keyboardType="phone-pad"
          accessibilityLabel="Phone Number"
          accessibilityHint="Enter your phone number"
          accessibilityRole="text"
        />
        <FormField
          control={form.control}
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

      <Button
        isDisabled={loginMutation.isPending}
        onPress={form.handleSubmit(onSubmit)}
        variant="primary"
      >
        {loginMutation.isPending ? (
          <Spinner color={themeColorAccentForeground} />
        ) : null}
        Log In
      </Button>
      <Text className="text-center text-xs text-muted mt-2">
        Forgot Password? <Text className="text-accent">Reset</Text>
      </Text>
    </View>
  );
}
