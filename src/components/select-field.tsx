import { Ionicons } from "@expo/vector-icons";
import { useController, type Control } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { Select, Button } from "heroui-native";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  control: Control<any, any, any>;
  name: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  defaultValue?: any;
}

export function SelectField(props: SelectFieldProps) {
  const {
    control,
    name,
    label,
    placeholder = "Select an option",
    options,
    disabled = false,
    defaultValue,
  } = props;

  const { field, fieldState } = useController({
    control,
    name,
    defaultValue,
  });

  const errorMessage = fieldState.error?.message;
  const selectedOption = options.find((opt) => opt.value === field.value);

  return (
    <View className="gap-2">
      {label ? (
        <Text className="text-sm font-medium text-secondary">{label}</Text>
      ) : null}

      <Select
        value={field.value ? { value: field.value, label: selectedOption?.label || "" } : undefined}
        onValueChange={(value) => {
          if (value?.value) {
            field.onChange(value.value);
          }
        }}
        isDisabled={disabled}
      >
        <Select.Trigger asChild>
          <Button
            variant="ghost"
            size="lg"
            isDisabled={disabled}
            className={`
              h-12 px-3 rounded-lg border flex-row items-center justify-between
              ${errorMessage ? "border-red-500" : "border-gray-300"}
              ${disabled ? "bg-gray-100 opacity-60" : "bg-white"}
            `}
          >
            <View className="flex-1 flex-row items-center justify-between">
              <Text
                className={`${
                  selectedOption ? "text-secondary" : "text-gray-400"
                }`}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </View>
          </Button>
        </Select.Trigger>

        <Select.Portal>
          <Select.Overlay />
          <Select.Content
            presentation="bottom-sheet"
            snapPoints={["50%"]}
            className="rounded-t-3xl"
          >
            <View className="px-4 py-2 border-b border-gray-200">
              <Text className="text-base font-semibold text-secondary text-center">
                {label || "Select an option"}
              </Text>
            </View>
            <ScrollView className="px-2 py-2">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  label={option.label}
                >
                  <View className="flex-1 flex-row items-center justify-between py-1">
                    <Select.ItemLabel className="text-base text-secondary" />
                    <Select.ItemIndicator />
                  </View>
                </Select.Item>
              ))}
            </ScrollView>
          </Select.Content>
        </Select.Portal>
      </Select>

      {errorMessage ? (
        <Text className="text-xs text-red-500">{errorMessage}</Text>
      ) : null}
    </View>
  );
}
