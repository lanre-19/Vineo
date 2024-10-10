"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { EditUserProfileSchema } from "@/lib/types";

interface ProfileFormProps {
    user: any;
    onUpdate: any;
    initialValues?: User;
}

const ProfileForm = ({
    user,
    onUpdate,
    initialValues
}: ProfileFormProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof EditUserProfileSchema>>({
        resolver: zodResolver(EditUserProfileSchema),
        defaultValues: {
            name: initialValues?.name || user.name,
            email: initialValues?.email || user.email
        },
        mode: "onChange"
    });

    const handleSubmit = async (values: z.infer<typeof EditUserProfileSchema>) => {
        setIsLoading(true);

        await onUpdate(values.name);

        setIsLoading(false);
    };

    useEffect(() => {
      form.reset({
        name: user.name,
        email: user.email
      });
      
    }, [user]);

    return (
        <Form
          {...form}
        >
            <form
              className="flex flex-col gap-3"
              onChange={form.handleSubmit(handleSubmit)}
            >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel
                          className="text-base"
                        >
                            Full name
                        </FormLabel>
                        <FormControl>
                            <Input
                              {...field}
                              placeholder="Name"
                              disabled={isLoading}
                            />
                        </FormControl>
                    </FormItem>
                  )}
                  disabled={isLoading}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel
                          className="text-base"
                        >
                            Email
                        </FormLabel>
                        <FormControl>
                            <Input
                              {...field}
                              placeholder="Email"
                              type="email"
                              disabled={isLoading}
                            />
                        </FormControl>
                    </FormItem>
                  )}
                  disabled={isLoading}
                />
                <Button
                  className="self-end text-white bg-[#2442c9] hover:bg-[#253fb3]"
                  type="button"
                >
                    {isLoading ? (
                        <Loader2
                          className="w-5 h-5 animate-spin"
                        />
                    ) : "Save"}
                </Button>
            </form>
        </Form>
    );
}
 
export default ProfileForm;