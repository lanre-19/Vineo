"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    playbackId: string;
    title: string;
    isLocked: boolean;
    completeOnEnd: boolean;
}

const VideoPlayer = ({
    courseId,
    chapterId,
    nextChapterId,
    playbackId,
    title,
    isLocked,
    completeOnEnd
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onEnd = async () => {
        try {
            if (completeOnEnd) {
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true
                });
            }

            if (!nextChapterId) {
                confetti.onOpen();
            }

            toast.success("Your progress has been updated.");
            router.refresh();

            if (nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

        } catch (error) {
            toast.error("Uh oh, something went wrong.");
        }
    };

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2 text-secondary">
                    <Lock className="w-8 h-8" />
                    <p className="text-sm">
                        This chapter is locked
                    </p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                  title={title}
                  className={cn(
                    !isReady && "hidden"
                  )}
                  onCanPlay={() => setIsReady(true)}
                  onEnded={onEnd}
                  playbackId={playbackId}
                  autoPlay
                />
            )}
        </div>
    );
}
 
export default VideoPlayer;