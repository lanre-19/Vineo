"use client";

import {
    forwardRef,
    ElementRef,
    useRef,
    KeyboardEventHandler
} from "react";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useOnClickOutside, useEventListener } from "usehooks-ts";

import FormTextarea from "@/components/form/form-textarea";
import FormSubmit from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";

import { useAction } from "@/hooks/use-action";
import { createCard } from "@/actions/create-card";

interface CardFormProps {
    listId: string;
    isEditing: boolean;
    enableEditing: () => void;
    disableEditing: () => void; 
}

const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
    listId,
    isEditing,
    enableEditing,
    disableEditing
}, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

    const { execute, fieldErrors } = useAction(createCard, {
        onSuccess: (data) => {
            toast.success(`Card "${data.title}" created`);
            formRef.current?.reset();
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    // Disable the editing state with the "Escape" key
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    // Submit the form with the "Enter" key
    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    };

    // Execute the fuction to create cards in their respective lists
    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const listId = formData.get("listId") as string;
        const boardId = params.boardId as string;

        console.log({
            title,
            listId,
            boardId
        });

        execute({
            title,
            listId,
            boardId
        });
    };

    if (isEditing) {
        return (
            <form
              ref={formRef}
              className="m-1 px-1 py-0.5 space-y-4"
              action={onSubmit}
            >
                <FormTextarea
                  ref={ref}
                  id="title"
                  onKeyDown={onTextareaKeyDown}
                  placeholder="Enter a title for this card..."
                  errors={fieldErrors}
                />
                <input
                  hidden
                  id="listId"
                  name="listId"
                  value={listId}
                />

                <div
                  className="flex items-center gap-x-1"
                >
                    <FormSubmit>
                        Add card
                    </FormSubmit>
                    <Button
                      onClick={disableEditing}
                      size="sm"
                      variant="ghost"
                    >
                        <X
                          className="w-5 h-5"
                        />
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <div
          className="pt-2 px-2"
        >
            <Button
              onClick={enableEditing}
              className="w-full h-auto px-2 py-1.5 justify-start text-muted-foreground text-sm"
              size="sm"
              variant="ghost"
            >
                <Plus
                  className="w-4 h-4 mr-2"
                />
                Add a card
            </Button>
        </div>
    )
})
 
export default CardForm;