"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface FormSubmitProps {
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "primary";
}

const FormSubmit = ({
    children,
    className,
    disabled,
    variant = "primary"
}: FormSubmitProps) => {
    const { pending } = useFormStatus();

    return (
        <Button
          type="submit"
          className={cn(className)}
          variant={variant}
          size="sm"
          disabled={pending || disabled}
        >
            {children}
        </Button>
    );
}
 
export default FormSubmit;