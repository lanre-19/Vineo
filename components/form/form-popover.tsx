"use client";

import { useRouter } from "next/navigation";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

import FormInput from "./form-input";
import FormPicker from "./form-picker";
import FormSubmit from "./form-submit";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { useProModal } from "@/hooks/use-pro-modal";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";

interface FormPopoverProps {
    children: React.ReactNode;
    sideOffset?: number;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
}

const FormPopover = ({
    children,
    sideOffset = 0,
    side = "bottom",
    align,
}: FormPopoverProps) => {
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null);
    const proModal = useProModal();

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success("New board created");
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        },
        onError: (error) => {
            toast.error(error);
            proModal.onOpen();
        }
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;

        execute({ title, image });
    };

    return (
        <Popover>
            <PopoverTrigger
              asChild
            >
                {children}
            </PopoverTrigger>
            <PopoverContent
              className="w-80 pt-3"
              side={side}
              align={align}
              sideOffset={sideOffset}
            >
                <div
                  className="text-sm text-neutral-600 text-center font-medium pb-4"
                >
                    Create a board
                </div>
                <PopoverClose
                  ref={closeRef}
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
                <form
                  action={onSubmit}
                  className="space-y-4"
                >
                    <div
                      className="space-y-4"
                    >
                        <FormPicker
                          id="image"
                          errors={fieldErrors}
                        />
                        <FormInput
                          label="Board title"
                          id="title"
                          type="text"
                          errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit
                      className="w-full"
                    >
                        Create
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
}
 
export default FormPopover;