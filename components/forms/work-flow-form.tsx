import React, { use } from 'react';
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import { onCreateWorkflow } from '@/app/(main)/(pages)/workflows/_actions/workflow-connections'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { WorkflowFormSchema } from '@/lib/types';

import { useModal } from "@/providers/modal-provider";
import { onCreateWorkflow } from '@/app/(main)/(pages)/workflows/_actions/work-flow-connections';

interface WorkflowFormProps {
    title?: string;
    subTitle?: string;
}

const WorkflowForm = ({
    title,
    subTitle
}: WorkflowFormProps) => {
    const router = useRouter();
    const { setClose } = useModal();

    const form = useForm<z.infer<typeof WorkflowFormSchema>>({
        resolver: zodResolver(WorkflowFormSchema),
        defaultValues: {
            name: "",
            description: ""
        },
        mode: "onChange"
    });

    const isLoading = form.formState.isSubmitting;

    const handleSubmit = async (values: z.infer<typeof WorkflowFormSchema>) => {
        const workflow = await onCreateWorkflow(values.name, values.description);

        if (workflow) {
            toast.message(workflow.message);

            router.refresh();
        }

        setClose();
    };
    
    return (
        <Card
          className="w-full max-w-[650px] border-none"
        >
            {title && subTitle && (
                <CardHeader>
                    <CardTitle>
                        {title}
                    </CardTitle>
                    <CardDescription>
                        {subTitle}
                    </CardDescription>
                </CardHeader>
            )}

            <CardContent>
                <Form
                  {...form}
                >
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="flex flex-col gap-4 text-left"
                    >
                        <FormField
                          name="name"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="What will you call your workflow?"
                                    />
                                </FormControl>
                            </FormItem>
                          )}
                          disabled={isLoading}
                        />

                        <FormField
                          name="description"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Describe your workflow"
                                    />
                                </FormControl>
                            </FormItem>
                          )}
                          disabled={isLoading}
                        />

                        <Button
                          className="text-white bg-[#2442c9] hover:bg-[#253fb3]"
                          type="submit"
                          disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2
                                  className="w-5 h-5 animate-spin"
                                />
                            ) : "Save"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
};

export default WorkflowForm;
