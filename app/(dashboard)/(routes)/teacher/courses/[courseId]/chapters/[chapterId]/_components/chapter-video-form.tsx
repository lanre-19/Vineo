"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import MuxPlayer from "@mux/mux-player-react";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import { Chapter, MuxData } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
    videoUrl: z.string().min(1)
});

interface ChapterVideoFormProps {
    initialData: Chapter & {
        muxData: MuxData | null;
    },
    courseId: string;
    chapterId: string;
}

const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    // Dynamically changes the editing state and render different UI
    const toggleEditing = () => setIsEditing((prev) => !prev);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter video has been updated.");
            router.refresh();
        } catch {
            toast.error("Uh oh, unable to update chapter video.");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter video
                <Button
                  onClick={toggleEditing}
                  variant="ghost"
                >
                    {isEditing && (
                        <>Cancel</>
                      )
                    }
                    {!isEditing && !initialData.videoUrl && (
                        <>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add a video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit video
                        </>
                      )
                    }
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <VideoIcon className="w-10 h-10 text-slate-700" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                          playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                      endPoint="chapterVideo"
                      onChange={(url) => {
                        if (url) {
                            onSubmit({ videoUrl: url });
                        }
                      }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload a video for this chapter.
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take a few minutes to process. Refresh the page if the video does not appear.
                </div>
            )}
        </div>
    );
}
 
export default ChapterVideoForm;