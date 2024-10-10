"use client";

import Image from "next/image";
import { CreditCard } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";

import { Skeleton } from "@/components/ui/skeleton";

interface InfoProps {
  isPro: boolean;
}

const Info = ({ isPro }: InfoProps) => {
    const { isLoaded, organization } = useOrganization();

    if (!isLoaded) {
        return (
            <Info.Skeleton />
        )
    }

    return (
        <div
          className="flex items-center gap-x-4"
        >
            <div
              className="w-[60px] h-[60px] relative"
            >
                <Image
                  src={organization?.imageUrl!}
                  alt={organization?.name!}
                  fill
                  className="rounded-md object-cover"
                />
            </div>
            <div
              className="space-y-1"
            >
                <p
                  className="text-xl font-semibold"
                >
                    {organization?.name}
                </p>
                <div
                  className="flex items-center text-xs text-muted-foreground"
                >
                    <CreditCard
                       className="w-3 h-3 mr-1"
                    />
                    {isPro ? "Pro" : "Free"}
                </div>
            </div>
        </div>
    );
}
 
export default Info;

Info.Skeleton = function SkeletonInfo () {
    return (
        <div
          className="flex items-center gap-x-4"
        >
            <div
              className="w-[60px] h-[60px] relative"
            >
                <Skeleton
                  className="w-full h-full absolute"
                />
            </div>
            <div
              className="space-y-2"
            >
                <Skeleton
                  className="w-[200px] h-10"
                />
                <div
                  className="flex items-center"
                >
                   <Skeleton
                     className="w-4 h-4 mr-2"
                   />
                   <Skeleton
                     className="w-[100px] h-4"
                   />
                </div>
            </div>
        </div>
    )
};