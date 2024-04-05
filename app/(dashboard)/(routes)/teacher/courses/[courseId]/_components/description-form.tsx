"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

const formSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required."
    })
});

interface DescriptionFormProps {
    initialData: Course,
    courseId: string;
}

const DescriptionForm = ({
    initialData,
    courseId
}: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    // Dynamically changes the editing state and render different UI
    const toggleEditing = () => setIsEditing((prev) => !prev);

    const router = useRouter();

    // Validate the form fields with its types
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        }
    });

    // The states of the form
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course description has been updated.");
            router.refresh();
        } catch {
            toast.error("Uh oh, unable to update course description.");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course description
                <Button
                  onClick={toggleEditing}
                  variant="ghost"
                >
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit description
                      </>
                      )
                    }
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {initialData.description || "No description"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4 mt-4"
                    >
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                      className="bg-blue-100/10"
                                      disabled={isSubmitting}
                                      placeholder="e.g. This is a beginner's course for UI-UX design"
                                      {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                              className="bg-[#2814f7] hover:bg-[#2714f7da]"
                              disabled={!isValid || isSubmitting}
                              type="submit"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}
 
export default DescriptionForm;