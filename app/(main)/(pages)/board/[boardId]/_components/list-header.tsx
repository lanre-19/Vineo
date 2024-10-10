"use client";

import { useState, useRef, ElementRef } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { List } from "@prisma/client";

import ListOptions from "./list-options";
import FormInput from "@/components/form/form-input";

import { useAction } from "@/hooks/use-action";
import { updateList } from "@/actions/update-list";

interface ListHeader {
    data: List;
    onAddCard: () => void;
}

const ListHeader = ({
    data,
    onAddCard
}: ListHeader) => {
    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const { execute } = useAction(updateList, {
        onSuccess: (data) => {
            toast.success(`Renamed to "${data.title}"`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const handleSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;
        const id = formData.get("id") as string;
        
        if (title === data.title) {
            return disableEditing();
        }

        execute({
            title,
            boardId,
            id
        });
    };

    const onBlur = () => {
        formRef.current?.requestSubmit();
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            formRef.current?.requestSubmit();
        }
    };

    useEventListener("keydown", onKeyDown);

    return (
        <div
          className="flex items-start justify-between gap-x-2 pt-2 px-2 text-sm font-semibold"
        >
            {isEditing ? (
                <form
                  action={handleSubmit}
                  ref={formRef}
                  className="flex-1 px-[2px]"
                >
                    <input
                      id="id"
                      name="id"
                      value={data.id}
                      hidden
                    />
                    <input
                      id="boardId"
                      name="boardId"
                      value={data.boardId}
                      hidden
                    />
                    <FormInput
                      ref={inputRef}
                      onBlur={onBlur}
                      id="title"
                      placeholder="Enter list title..."
                      defaultValue={title}
                      className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                    />
                    <button
                      type="submit"
                      hidden
                    />
                </form>
            ) : (
                <div
                  onClick={enableEditing}
                  className="w-full h-full text-sm px-2.5 py-1 font-medium border-transparent"
                >
                    {title}
                </div>
            )}
            <ListOptions
              data={data}
              onAddCard={onAddCard}
            />
        </div>
    );
}
 
export default ListHeader;