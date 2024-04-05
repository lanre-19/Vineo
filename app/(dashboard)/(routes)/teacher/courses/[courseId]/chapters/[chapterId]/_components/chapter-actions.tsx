"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

const ChapterActions = ({
    disabled,
    courseId,
    chapterId,
    isPublished
}: ChapterActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const onPublish = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("Chapter has been unpublished.");
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Chapter has been published.");
            }

            router.refresh();
        } catch {
            toast.error("Uh oh, unable to publish chapter.");
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Chapter has been deleted.");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
        } catch {
            toast.error("Uh oh, unable to delete chapter.");
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
 
export default ChapterActions;