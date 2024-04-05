"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

const CourseActions = ({
    disabled,
    courseId,
    isPublished
}: CourseActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const confetti = useConfettiStore();

    const router = useRouter();

    const onPublish = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course has been unpublished.");
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course has been published.");
                confetti.onOpen();
            }

            router.refresh();
        } catch {
            toast.error("Uh oh, unable to publish course.");
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Course has been deleted.");
            router.refresh();
            router.push(`/teacher/courses`);
        } catch {
            toast.error("Uh oh, unable to delete course.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-x-2">
            <Button
              onClick={onPublish}
              disabled={disabled || isLoading}
              variant="outline"
              size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal
              onConfirm={onDelete}
            >
              <Button
                className="bg-red-600 hover:bg-red-600 bg-opacity-60"
                size="sm"
                variant="destructive"
                disabled={isLoading}
              >
                <Trash className="w-4 h-4 text-white" />
              </Button>
            </ConfirmModal>
        </div>
    );
}
 
export default CourseActions;