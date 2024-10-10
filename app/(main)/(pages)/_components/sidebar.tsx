"use client";

import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { Plus } from "lucide-react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import NavItem, { Organization } from "./nav-item";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface SidebarProps {
    storageKey?: string;
}

const Sidebar = ({
    storageKey = "t-sidebar-state"
}: SidebarProps) => {
    const router = useRouter();
    const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
        storageKey,
        {}
    );

    const { organization: activeOrg, isLoaded: isLoadedOrg } = useOrganization();
    const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
        userMemberships: {
            infinite: true
        }
    });

    const defaultAccordionValue: string[] = Object.keys(expanded)
      .reduce((acc: string[], key: string) => {
        if (expanded[key]) {
            acc.push;
        }

        return acc;
    }, []);

    const onExpand = (id: string) => {
        setExpanded((curr) => ({
            ...curr,
            [id]: !expanded[id]
        }));
    };

    if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
        return (
            <>
              <div
                className="flex items-center justify-between mb-2"
              >
                <Skeleton
                  className="h-10 w-[50%]"
                />
                <Skeleton
                  className="h-10 w-10"
                />
              </div>
              <div
                className="space-y-2"
              >
                <NavItem.Skeleton />
                <NavItem.Skeleton />
                <NavItem.Skeleton />
                <NavItem.Skeleton />
              </div>
            </>
        )
    }

    return (
        <>
          <div
            className="flex items-center text-base font-bold mb-1"
          >
            <span>
                Workspaces
            </span>
            <Button
              onClick={() => router.push("/select-org")}
              className="ml-auto"
              type="button"
              size="icon"
              variant="ghost"
            >
                <Plus
                  className="w-5 h-5"
                />
            </Button>
          </div>
          <Accordion
            className="space-y-2"
            type="multiple"
            defaultValue={defaultAccordionValue}
          >
            {userMemberships.data.map(({ organization }) => (
                <NavItem
                  key={organization.id}
                  isActive={activeOrg?.id === organization.id}
                  isExpanded={expanded[organization.id]}
                  organization={organization as Organization}
                  onExpand={onExpand}
                />
            ))}
          </Accordion>
        </>
    );
}
 
export default Sidebar;