"use client";

import { List } from "@prisma/client";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import {
    X,
    MoreHorizontal,
    Plus,
    Copy,
    Trash
} from "lucide-react";

import FormSubmit from "@/components/form/form-submit";
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useAction } from "@/hooks/use-action";
import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";

interface ListOptions {
    data: List;
    onAddCard: () => void;
}

const ListOptions = ({
    data,
    onAddCard
}: ListOptions) => {
    const closeRef = useRef<ElementRef<"button">>(null);

    const { execute: executeDelete } = useAction(deleteList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" deleted`);
            closeRef.current?.click();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const { execute: executeCopy } = useAction(copyList, {
        onSuccess: (data) => {
            console.log("Copy successful", data);
            toast.success(`List "${data.title}" copied`);
            closeRef.current?.click();
        },
        onError: (error) => {
            console.log("Copy error", error);
            toast.error(error);
        }
    });

    // Function to delete lists
    const onDelete = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        executeDelete({
            id,
            boardId
        });
    };

    // Function to copy lists
    const onCopy = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        console.log(id, boardId);

        executeCopy({
            id,
            boardId
        });
    };

    return (
        <Popover>
            <PopoverTrigger
              asChild
            >
                <Button
                  className="w-auto h-auto p-2"
                  variant="ghost"
                >
                    <MoreHorizontal
                      className="w-4 h-4"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent
              className="px-0 pt-3 pb-3"
              side="bottom"
              align="start"
            >
                <div
                  className="text-sm font-medium text-center text-neutral-600 pb-4"
                >
                    List actions
                </div>
                <PopoverClose
                  ref={closeRef}
                  asChild
                >
                    <Button
                      className="w-auto h-auto absolute top-2 right-2 text-neutral-600"
                      variant="ghost"
                    >
                        <X
                          className="w-4 h-4"
                        />
                    </Button>
                </PopoverClose>
                <Button
                  onClick={onAddCard}
                  className="w-full h-auto rounded-none p-2 px-5 text-sm font-normal justify-start"
                  variant="ghost"
                >
                    <Plus
                      className="w-4 h-4 mr-2"
                    />
                    Add card
                </Button>
                <form
                  action={onCopy}
                >
                    <input
                      hidden
                      name="id"
                      id="id"
                      value={data.id}
                    />
                    <input
                      hidden
                      name="boardId"
                      id="boardId"
                      value={data.boardId}
                    />
                    <FormSubmit
                      className="w-full h-auto p-2 px-5 text-sm font-normal justify-start"
                      variant="ghost"
                    >
                        <Copy
                          className="w-4 h-4 mr-2"
                        />
                        Copy list
                    </FormSubmit>
                </form>
                <Separator />
                <form
                  action={onDelete}
                >
                    <input
                      hidden
                      name="id"
                      id="id"
                      value={data.id}
                    />
                    <input
                      hidden
                      name="boardId"
                      id="boardId"
                      value={data.boardId}
                    />
                    <FormSubmit
                      className="w-full h-auto p-2 px-5 text-sm font-normal justify-start hover:bg-red-400/10"
                      variant="ghost"
                    >
                        <Trash
                          className="w-4 h-4 text-red-500 mr-2"
                        />
                        Delete list
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
}
 
export default ListOptions;