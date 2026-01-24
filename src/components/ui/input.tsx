import {
  cn,
  TextField,
  type TextFieldInputProps,
  type TextFieldRootProps,
} from "heroui-native";
import { View, type TextInputProps } from "react-native";

interface Props {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  labelClassName?: string;
}

type BaseInputProps = TextFieldRootProps & TextInputProps & TextFieldInputProps;

export type InputProps = Props & BaseInputProps;

export function Input(props: InputProps) {
  const {
    label,
    placeholder,
    description,
    errorMessage,
    isInvalid,
    isDisabled,
    isRequired,
    prefix,
    suffix,
    className,
    labelClassName,
    ...inputProps
  } = props;
  return (
    <TextField isInvalid={isInvalid} isDisabled={isDisabled}>
      {label ? (
        <TextField.Label
          className={cn("text-sm font-medium", labelClassName)}
          isInvalid={false}
        >
          {label}
        </TextField.Label>
      ) : null}
      <View className="w-full flex-row items-center">
        <TextField.Input
          placeholder={placeholder}
          isInvalid={false}
          className={cn(
            "w-full border border-gray-300 h-12 shadow-none",
            prefix ? "pl-10" : "",
            suffix ? "pr-10" : "",
            className,
          )}
          {...inputProps}
        />
        {prefix ? <View className="absolute left-3.5">{prefix}</View> : null}
        {suffix ? <View className="absolute right-4">{suffix}</View> : null}
      </View>
      {description ? (
        <TextField.Description>{description}</TextField.Description>
      ) : null}
      {errorMessage ? (
        <TextField.ErrorMessage>{errorMessage}</TextField.ErrorMessage>
      ) : null}
    </TextField>
  );
}
