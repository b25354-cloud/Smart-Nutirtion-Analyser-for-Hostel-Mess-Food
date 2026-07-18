import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { FormField } from '@/components/forms/FormField';

interface RHFTextFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
}

export const RHFTextField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: RHFTextFieldProps<TFieldValues>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <FormField error={fieldState.error?.message} label={label}>
        <input
          {...field}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2"
          placeholder={placeholder}
          type="text"
        />
      </FormField>
    )}
  />
);
