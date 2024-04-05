"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";

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
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import ChaptersList from "./chapters-list";

const formSchema = z.object({
    title: z.string().min(1)
});

interface ChapterFormProps {
    initialData: Course & {
        chapters: Chapter[];
    },
    courseId: string;
}

const ChapterForm = ({
    initialData,
    courseId
}: ChapterFormProps) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Dynamically changes the editing state and render different UI
    const toggleCreating = () => setIsCreating((prev) => !prev);

    const router = useRouter();

    // Validate the form fields with its types
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    });

    // The states of the form
    const { isSubmitting, isValid } = form.formState;

    // Function to create enable users to create chapters
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Course chapters have been updated.");
            router.refresh();
        } catch {
            toast.error("Uh oh, unable to update course chapters.");
        }
    };

    // Function to reorder the position the chapters
    const onReorder = async (updateData: { id: string, position: number }[]) => {
        try {
            setIsUpdating(true);
            
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            });
            toast.success("Your chapters have been reordered.");
            router.refresh();
        } catch {
            toast.error("Uh oh, unable to reorder your chapters.")
        } finally {
            setIsUpdating(false);
        }
    };

    // Function to enable users to edit chapters
    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    };

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute w-full h-full bg-slate-500/30 top-0 right-0 rounded-md flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button
                  onClick={toggleCreating}
                  variant="ghost"
                >
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add a chapter
                      </>
                      )
                    }
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4 mt-4"
                    >
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                      className="bg-blue-100/10"
                                      disabled={isSubmitting}
                                      placeholder="e.g. Introduction to UI-UX design"
                                      {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                            className="bg-[#2814f7] hover:bg-[#2714f7da]"
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && "No chapters"}
                    <ChaptersList
                      items={initialData.chapters || []}
                      onEdit={onEdit}
                      onReorder={onReorder}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters.
                </p>
            )}
        </div>
    );
}
 
export default ChapterForm;