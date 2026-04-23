import { Input } from "../ui/input";
import { useFormContext, type FieldErrors } from "react-hook-form";

type FormInputProps = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  min?: number;
  size?: string;
  className?: string;
};

export default function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  size = "lg",
  min,
  className,
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = name.split(".").reduce((acc: FieldErrors, key) => {
    return acc?.[key] as FieldErrors;
  }, errors as FieldErrors);

  const hasError = !!error;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        className={`text-xs flex items-center justify-between pr-6  ${hasError ? "text-red-500" : "text-text-muted"}`}
      >
        {label}
        {hasError && size === "lg" && (
          <span className="text-red-500">can't be empty</span>
        )}
      </label>

      <Input
        type={type}
        placeholder={placeholder}
        min={min}
        className={hasError ? `border-red-500 focus-visible:ring-red-500 ` : ""}
        onKeyDown={(e) => {
          if (type === "number" && ["-", "e"].includes(e.key)) {
            e.preventDefault();
          }
        }}
        {...register(name, { valueAsNumber: type === "number" })}
      />

      {/* {hasError && <p className="text-red-500 text-sm">{label} is required</p>} */}
    </div>
  );
}
