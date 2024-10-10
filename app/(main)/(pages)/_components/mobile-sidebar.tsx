"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import Sidebar from "./sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";

const MobileSidebar = () => {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    const isOpen = useMobileSidebar((state) => state.isOpen);
    const onOpen = useMobileSidebar((state) => state.onOpen);
    const onClose = useMobileSidebar((state) => state.onClose);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    if (!isMounted) {
        return null;
    }

    return (
        <>
          <Menu
            onClick={onOpen}
            className="block md:hidden w-6 h-6 cursor-pointer"
          />

          <Sheet
            open={isOpen}
            onOpenChange={onClose}
          >
            <SheetContent
              className="p-2 pt-14"
              side="left"
            >
                <Sidebar
                  storageKey="t-sidebar-mobile-state"
                />
            </SheetContent>
          </Sheet>
        </>
    );
}
 
export default MobileSidebar;