import { XCircle } from "lucide-react";

interface FormErrorsProps {
    id: string;
    errors?: Record<string , string[] | undefined>;
}

const FormErrors = ({
    id,
    errors
}: FormErrorsProps) => {
    if (!errors) {
        return null;
    }

    return (
        <div
          id={`${id}-error`}
          aria-live="polite"
          className="text-xs text-rose-500 mt-2"
        >
            {errors?.[id]?.map((error: string) => (
                <div
                  key={error}
                  className="flex items-center font-medium p-2 border-rose-500 bg-rose-500/10 rounded-sm"
                >
                    <XCircle
                      className="w-4 h-4 mr-2"
                    />
                    {error}
                </div>
            ))}
        </div>
    );
}
 
export default FormErrors;