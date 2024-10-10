"use client";

import { forwardRef, KeyboardEventHandler } from "react";
import { useFormStatus } from "react-dom";

import FormErrors from "./form-errors";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

interface FormTextareaProps {
    label?: string;
    placeholder?: string;
    className?: string;
    defaultValue?: string;
    id: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
    label,
    placeholder,
    className,
    defaultValue,
    id,
    required,
    disabled,
    errors,
    onBlur,
    onClick,
    onKeyDown
}, ref) => {
    const { pending } = useFormStatus();

    return (
        <div
          className="space-y-2 w-full"
        >
            <div
              className="space-y-1 w-full"
            >
                {label ? (
                    <Label
                      htmlFor={id}
                      className="text-xs font-semibold text-neutral-700"
                    >
                        {label}
                    </Label>
                ) : null}
                <Textarea
                  onKeyDown={onKeyDown}
                  onBlur={onBlur}
                  onClick={onClick}
                  ref={ref}
                  required={required}
                  placeholder={placeholder}
                  name={id}
                  id={id}
                  disabled={pending || disabled}
                  className={cn(
                    "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
                    className
                  )}
                  aria-describedby={`${id}-error`}
                  defaultValue={defaultValue}
                />
            </div>

            <FormErrors
              id={id}
              errors={errors}
            />
        </div>
    );
})
 
export default FormTextarea;

FormTextarea.displayName = "FormTextarea";