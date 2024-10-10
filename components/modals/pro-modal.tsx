"use client";

import Image from "next/image";
import { toast } from "sonner";
import { CrownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { useProModal } from "@/hooks/use-pro-modal";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";

const ProModal = () => {
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
        execute({});
    };

    return (
        <Dialog
          open={proModal.isOpen}
          onOpenChange={proModal.onClose}
        >
            <DialogContent
              className="max-w-md p-0 overflow-hidden"
            >
                <div
                  className="aspect-video relative flex items-center justify-center"
                >
                    <Image
                      src="/hero.svg"
                      alt="Hero"
                      fill
                      className="object-cover"
                    />
                </div>
                <div
                  className="text-neutral-700 mx-auto space-y-6 p-6"
                >
                    <h2
                      className="text-xl font-semibold"
                    >
                        Upgrade to Vineo Pro Today!
                    </h2>
                    <p
                      className="text-xs font-semibold text-neutral-600"
                    >
                        What Vineo pro has to offer:
                    </p>
                    <div
                      className="pl-3"
                    >
                        <ul
                          className="text-sm list-disc"
                        >
                            <li>Unlimited boards</li>
                            <li>24/7 customer support</li>
                            <li>Admin and security features</li>
                            <li>And much more!</li>
                        </ul>
                    </div>
                    <Button
                      onClick={onClick}
                      className="w-full"
                      disabled={isLoading}
                      variant="primary"
                    >
                        Upgrade to pro
                        <CrownIcon
                          className="w-5 h-5 ml-2"
                        />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
 
export default ProModal;