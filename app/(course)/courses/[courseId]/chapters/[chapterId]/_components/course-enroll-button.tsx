"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string
}

const CourseEnrollButton = ({ price, courseId }: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post(`/api/courses/${courseId}/checkout`);

            window.location.assign(response.data?.url);
        } catch {
            toast.error("Uh oh, something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
          onClick={onClick}
          size="sm"
          disabled={isLoading}
          className="w-full md:w-auto bg-[#2814f7] hover:bg-[#2714f7da]"
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Enroll for {formatPrice(price)}
        </Button>
    );
}
 
export default CourseEnrollButton;