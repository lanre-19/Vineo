"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

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

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required."
    })
});

const CreateCourse = () => {
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

    // Function to send the user's details to the API to create courses in the database
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            router.push(`/teacher/courses/${response.data.id}`);
            toast.success("New course has been created.");
        } catch {
            toast.error("Uh oh! Failed to create course.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl font-bold">Name your course</h1>
                <p className="text-sm text-slate-600">What would you like to name your course? Don&apos;t worry, you can always change this later.</p>
                <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8 pt-8"
                    >
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Course title
                                </FormLabel>
                                <FormControl>
                                    <Input
                                      placeholder="e.g. UI-UX design for beginners"
                                      disabled={isSubmitting}
                                      {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    What will you teach in this course?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/">
                                <Button
                                  variant="outline"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                              className="bg-[#2814f7] hover:bg-[#2714f7da]"
                              type="submit"
                              disabled={!isValid || isSubmitting}
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
 
export default CreateCourse;