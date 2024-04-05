"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseProgressButtonProps {
    courseId: string;
    chapterId: string;
    nextChapterId: string;
    isCompleted?: boolean;
}

const CourseProgressButton = ({
    courseId,
    chapterId,
    nextChapterId,
    isCompleted
}: CourseProgressButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            });

            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success("Your progress has been updated.");
            router.refresh();

        } catch {
            toast.error("Uh oh, something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    const Icon = isCompleted ? XCircle : CheckCircle;

    return (
        <Button
          onClick={onClick}
          type="button"
          variant={isCompleted ? "outline" : "success"}
          size="sm"
          disabled={isLoading}
          className="w-full md:w-auto"
        >
            {isCompleted ? "Mark as incomplete" : "Mark as complete"}
            <Icon className="w-4 h-4 ml-2" />
        </Button>
    );
}
 
export default CourseProgressButton;