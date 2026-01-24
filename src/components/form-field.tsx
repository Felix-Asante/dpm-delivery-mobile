import { useController, type Control, type FieldValues } from "react-hook-form";
import { Input, type InputProps } from "./ui/input";

interface FormFieldProps extends InputProps {
  control: Control<FieldValues, any, FieldValues>;
  name: string;
  defaultValue?: any;
}

export function FormField(props: FormFieldProps) {
  const { control, name, defaultValue, ...inputProps } = props;
  const { field, fieldState } = useController({
    control,
    name,
    defaultValue,
  });

  const errorMessage = fieldState.error?.message;

  return (
    <Input
      onChangeText={field.onChange}
      value={field.value}
      errorMessage={errorMessage}
      isInvalid={!!errorMessage}
      {...inputProps}
    />
  );
}
