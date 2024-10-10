"use client";

import { toast } from "sonner";
import { X, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Popover,
    PopoverClose,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { useAction } from "@/hooks/use-action";
import { deleteBoard } from "@/actions/delete-board";

interface BoardOptionsProps {
    id: string;
}

const BoardOptions = ({
    id
}: BoardOptionsProps) => {
  const router = useRouter();

  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error)
    }
  });

  const onDelete = () => {
    execute({ id });
    router.refresh();
  };

    return (
        <Popover>
            <PopoverTrigger
              asChild
            >
                <Button
                  className="w-auto h-auto p-2 hover:bg-transparent hover:text-white mt-2"
                  variant="ghost"
                >
                    <MoreHorizontal
                      className="w-4 h-4"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent
              className="px-0 pt-3 pb-3"
              align="start"
              side="bottom"
            >
                <div
                  className="text-sm text-center text-neutral-600 font-medium pb-4"
                >
                    Board actions
                </div>
                <PopoverClose
                  asChild
                >
                    <Button
                      className="w-auto h-auto p-2 absolute top-2 right-2 text-neutral-600"
                      variant="ghost"
                    >
                        <X
                          className="w-4 h-4"
                        />
                    </Button>
                </PopoverClose>
                <Button
                  onClick={onDelete}
                  className="w-full h-auto rounded-none p-2 px-5 justify-start text-sm bg-red-300/10 font-normal hover:bg-red-400/10"
                  variant="ghost"
                  disabled={isLoading}
                >
                    <Trash
                      className="w-4 h-4 text-red-500 mr-2"
                    />
                    Delete this board
                </Button>
            </PopoverContent>
        </Popover>
    );
}
 
export default BoardOptions;