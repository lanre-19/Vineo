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
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

const formSchema = z.object({
    price: z.coerce.number()
});

interface PriceFormProps {
    initialData: Course,
    courseId: string;
}

const PriceForm = ({
    initialData,
    courseId
}: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    // Dynamically changes the editing state and render different UI
    const toggleEditing = () => setIsEditing((prev) => !prev);

    const router = useRouter();

    // Validate the form fields with its types
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined
        }
    });

    // The states of the form
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course price has been updated.");
            router.refresh();
        } catch {
            toast.error("Uh oh, unable to update course price.");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course price
                <Button
                  onClick={toggleEditing}
                  variant="ghost"
                >
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit price
                      </>
                      )
                    }
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData?.price && "text-slate-500 italic"
                )}>
                    {initialData?.price ? formatPrice(initialData.price) : "No price"}
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
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                      className="bg-blue-100/10"
                                      disabled={isSubmitting}
                                      type="number"
                                      step="0.01"
                                      placeholder="Set a price for your course"
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
 
export default PriceForm;