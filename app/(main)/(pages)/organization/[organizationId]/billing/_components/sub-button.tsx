"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";

interface SubButtonProps {
    isPro: boolean
}

const SubButton = ({ isPro }: SubButtonProps) => {
    const proModal = useProModal();

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => {
            window.location.href = data;
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onClick = () => {
        if (isPro) {
            execute({});
        } else {
            proModal.onOpen();
        }
    };

    return (
        <Button
          onClick={onClick}
          className="rounded-md"
          disabled={isLoading}
          variant="primary"
        >
            {isPro ? "Manage subscription" : "Upgrade to pro"}
        </Button>
    );
}
 
export default SubButton;