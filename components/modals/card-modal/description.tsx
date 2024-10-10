"use client";

import { toast } from "sonner";
import { ElementRef, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { AlignLeft } from "lucide-react";

import FormTextarea from "@/components/form/form-textarea";
import FormSubmit from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { CardWithList } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";

interface DescriptionProps {
    data: CardWithList;
}

const Description = ({ data }: DescriptionProps) => {
    const params = useParams();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);

    const fomrRef = useRef<ElementRef<"form">>(null);
    const textareaRef = useRef<ElementRef<"textarea">>(null);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(fomrRef, disableEditing);

    const { execute, fieldErrors } = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id]
            });

            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id]
            });

            toast.success(`Card "${data.title}" updated`);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onSubmit = (formData: FormData) => {
        const description = formData.get("description") as string;
        const boardId = params.boardId as string;
        
        execute({
            description,
            boardId,
            id: data.id
        })
    };

    return (
        <div
          className="flex items-start w-full gap-x-3"
        >
            <AlignLeft
              className="w-5 h-5 text-neutral-700 mt-0.5"
            />
            <div
              className="w-full"
            >
                <p
                  className="text-neutral-700 font-semibold mb-2"
                >
                    Description
                </p>
                {isEditing ? (
                    <form
                      action={onSubmit}
                    >
                        <FormTextarea
                          ref={textareaRef}
                          id="description"
                          placeholder="Add a description..."
                          errors={fieldErrors}
                          defaultValue={data.description || undefined}
                          className="w-full mt-2"
                        />
                        <div
                          className="flex items-center gap-x-2 mt-2"
                        >
                            <FormSubmit>
                                Save
                            </FormSubmit>
                            <Button
                              onClick={disableEditing}
                              type="button"
                              size="sm"
                              variant="ghost"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div
                      onClick={enableEditing}
                      className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
                      role="button"
                    >
                        {data.description || "Add a description..."}
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default Description;

Description.Skeleton = function DescriptionSkeleton() {
    return (
        <div
          className="flex items-start w-full gap-x-3"
        >
            <Skeleton
              className="w-6 h-6 bg-neutral-200"
            />
            <div
              className="w-full"
            >
                <Skeleton
                  className="w-24 h-6 mb-2 bg-neutral-200"
                />
                <Skeleton
                  className="w-full h-[78px] bg-neutral-200"
                />
            </div>
        </div>
    )
};