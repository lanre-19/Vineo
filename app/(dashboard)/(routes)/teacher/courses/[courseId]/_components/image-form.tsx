"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";

import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required."
    })
});

interface ImageFormProps {
    initialData: Course,
    courseId: string;
}

const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    // Dynamically changes the editing state and render different UI
    const toggleEditing = () => setIsEditing((prev) => !prev);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course image has been updated.");
            router.refresh();
        } catch {
            toast.error("Uh oh, unable to update course image.");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course image
                <Button
                  onClick={toggleEditing}
                  variant="ghost"
                >
                    {isEditing && (
                        <>Cancel</>
                      )
                    }
                    {!isEditing && !initialData.imageUrl && (
                        <>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit image
                        </>
                      )
                    }
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="w-10 h-10 text-slate-700" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                          src={initialData.imageUrl}
                          alt="Uploaded image"
                          fill
                          className="object-cover rounded-md"
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                      endPoint="courseImage"
                      onChange={(url) => {
                        if (url) {
                            onSubmit({ imageUrl: url });
                        }
                      }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default ImageForm;