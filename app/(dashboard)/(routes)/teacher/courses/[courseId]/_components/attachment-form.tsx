"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Attachment, Course } from "@prisma/client";

import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
    url: z.string().min(1)
});

interface AttachmentFormProps {
    initialData: Course & {
        attachments: Attachment[];
    };
    courseId: string;
}

const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Dynamically changes the editing state and render different UI
    const toggleEditing = () => setIsEditing((prev) => !prev);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course attachment have been updated.");
            router.refresh();
        } catch {
            toast.error("Uh oh, unable to update course attachment.");
        }
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Course attachment has been deleted.");
            router.refresh();
        } catch {
            toast.error("Uh oh, unable to delete attachment.")
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachments
                <Button
                  onClick={toggleEditing}
                  variant="ghost"
                >
                    {isEditing && (
                        <>Cancel</>
                      )
                    }
                    {!isEditing && (
                        <>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                  {initialData.attachments.length === 0 && (
                    <p className="text-sm text-slate-500 mt-2 italic">No attachments</p>
                  )}
                </>
            )}
            {initialData.attachments.length > 0 && (
                <div className="space-y-2">
                    {initialData.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center p-3 w-full bg-blue-100 border-blue-200 border text-blue-700 rounded-md">
                            <File className="w-4 h-4 mr-2 flex-shrink-0" />
                            <p className="text-xs line-clamp-1">
                                {attachment.name}
                            </p>
                            {deletingId === attachment.id && (
                                <Loader2 className="ml-auto w-4 h-4 animate-spin" />
                            )}
                            {deletingId !== attachment.id && (
                                <button
                                  onClick={() => onDelete(attachment.id)}
                                  className="ml-auto hover:opacity-75 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                      endPoint="courseAttachment"
                      onChange={(url) => {
                        if (url) {
                            onSubmit({ url: url });
                        }
                      }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your student might need to complete this course.
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default AttachmentForm;