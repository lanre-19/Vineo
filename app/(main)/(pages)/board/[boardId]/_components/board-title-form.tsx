"use client";

import { useRef, ElementRef, useState } from "react";
import { Board } from "@prisma/client";
import { toast } from "sonner";

import FormInput from "@/components/form/form-input";
import { Button } from "@/components/ui/button";

import { updateBoard } from "@/actions/update-board";
import { useAction } from "@/hooks/use-action";

interface BoardTitleFormProps {
    data: Board;
}

const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
    const { execute } = useAction(updateBoard, {
        onSuccess: (data) => {
            toast.success(`Board "${data.title}" updated`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);

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

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;

        execute({
            title,
            id: data.id
        });
    }

    const onBlur = () => {
        formRef.current?.requestSubmit();
    };

    if (isEditing) {
        return (
            <form
              action={onSubmit}
              className="flex items-center gap-x-2"
              ref={formRef}
            >
                <FormInput
                  className="text-lg font-bold px-[7px] py-1 h-7 mt-3 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
                  id="title"
                  ref={inputRef}
                  defaultValue={title}
                  onBlur={onBlur}
                />
            </form>
        )
    }

    return (
        <Button
          onClick={enableEditing}
          className="text-lg w-auto h-auto font-bold p-1 px-2 mt-2 hover:bg-transparent hover:text-white"
          variant="ghost"
        >
            {title}
        </Button>
    );
}
 
export default BoardTitleForm;