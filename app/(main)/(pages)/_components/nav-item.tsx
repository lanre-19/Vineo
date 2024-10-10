"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    Layout,
    CreditCard,
    Activity,
    Settings
} from "lucide-react";

import {
    AccordionContent,
    AccordionTrigger,
    AccordionItem
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

export type Organization = {
    id: string;
    slug: string;
    name: string;
    imageUrl: string;
}

interface NavItemProps {
    isActive: boolean;
    isExpanded: boolean;
    organization: Organization
    onExpand: (id: string) => void;
}

const NavItem = ({
    isActive,
    isExpanded,
    organization,
    onExpand
}: NavItemProps) => {

    const router = useRouter();
    const pathname = usePathname();

    const routes = [
        {
            label: "Boards",
            icon: <Layout className="w-4 h-4 mr-2" />,
            href: `/organization/${organization.id}`
        },
        {
            label: "Activity",
            icon: <Activity className="w-4 h-4 mr-2" />,
            href: `/organization/${organization.id}/activity`
        },
        {
            label: "Settings",
            icon: <Settings className="w-4 h-4 mr-2" />,
            href: `/organization/${organization.id}/settings`
        },
        {
            label: "Billing",
            icon: <CreditCard className="w-4 h-4 mr-2" />,
            href: `/organization/${organization.id}/billing`
        },
    ];

    const onClick = (href: string) => {
        router.push(href);
    };

    return (
        <AccordionItem
          className="border-none"
          value={organization.id}
        >
            <AccordionTrigger
              onClick={() => onExpand(organization.id)}
              className={cn(
                "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
                isActive && !isExpanded && "text-blue-700 bg-blue-500/10"
              )}
            >
                <div
                  className="flex items-center gap-x-2"
                >
                    <div
                      className="w-7 h-7 relative"
                    >
                        <Image
                          src={organization.imageUrl}
                          alt={organization.name}
                          fill
                          className="rounded-sm object-cover"
                        />
                    </div>
                    <span
                      className="text-sm font-medium"
                    >
                        {organization.name}
                    </span>
                </div>
            </AccordionTrigger>

            <AccordionContent
              className="text-neutral-700 pt-1"
            >
                {routes.map((route) => (
                    <Button
                      key={route.href}
                      onClick={() => router.push(route.href)}
                      className={cn(
                        "w-full justify-start font-normal pl-10 mb-1",
                        pathname === route.href && "text-blue-700, bg-blue-500/10"
                      )}
                      variant="ghost"
                      size="sm"
                    >
                      {route.icon}
                      {route.label}
                    </Button>
                ))}
            </AccordionContent>
        </AccordionItem>
    );
}
 
export default NavItem;

NavItem.Skeleton = function SkeletonNavItem() {
    return (
        <div
          className="flex items-center gap-x-2"
        >
            <div
              className="w-10 h-10 relative shrink-0"
            >
                <Skeleton
                  className="w-full h-full absolute"
                />
            </div>
            <Skeleton
              className="h-10 w-full"
            />
        </div>
    )
};