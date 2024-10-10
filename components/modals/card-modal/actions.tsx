"use client";

import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Copy, Trash } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { CardWithList } from "@/types";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";

interface ActionsProps {
    data: CardWithList;
}

const Actions = ({ data }: ActionsProps) => {
    const params = useParams();
    const cardModal = useCardModal();

    const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(deleteCard, {
        onSuccess: (data) => {
            toast.success(`Card "${data.title}" deleted`);
            cardModal.onClose();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(copyCard, {
        onSuccess: (data) => {
            toast.success(`Card "${data.title}" copied`);
            cardModal.onClose();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onCopy = () => {
        const boardId = params.boardId as string;

        executeCopyCard({
            boardId,
            id: data.id
        });
    };

    const onDelete = () => {
        const boardId = params.boardId as string;

        executeDeleteCard({
            boardId,
            id: data.id
        });
    };

    return (
        <div
          className="space-y-2 mt-2"
        >
            <p
              className="textxs font-semibold"
            >
                Actions
            </p>
            <Button
              onClick={onCopy}
              className="w-full justify-start"
              size="inline"
              variant="gray"
              disabled={isLoadingCopy}
            >
                <Copy
                  className="w-4 h-4 mr-2"
                />
                Copy
            </Button>
            <Button
              onClick={onDelete}
              className="w-full justify-start"
              size="inline"
              variant="gray"
              disabled={isLoadingDelete}
            >
                <Trash
                  className="w-4 h-4 mr-2"
                />
                Delete
            </Button>
        </div>
    );
}
 
export default Actions;

Actions.Skeleton = function ActionsSkeleton() {
    return (
        <div
          className="space-y-2 mt-2"
        >
            <Skeleton
              className="w-20 h-4 bg-neutral-200"
            />
            <Skeleton
              className="w-full h-8 bg-neutral-200"
            />
            <Skeleton
              className="w-full h-8 bg-neutral-200"
            />
        </div>
    )
}