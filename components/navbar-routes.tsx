"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import SearchInput from "./search-input";


const NavbarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { userId } = useAuth();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/search";

    return (
      <>
        {isSearchPage && (
          <div className="hidden md:block">
            <SearchInput />
          </div>
        )}
        <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isCoursePage ? (
                <Link href="/">
                  <Button
                    className="hover:bg-blue-300/20 hover:text-blue-800 transition"
                    size="sm"
                    variant="ghost"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Exit
                  </Button>
                </Link>
            ) : (
                <Link href="/teacher/courses">
                    <Button
                      className="hover:bg-blue-300/20 hover:text-blue-800 transition"
                      size="sm"
                      variant="ghost"
                    >
                      Teacher mode
                    </Button>
                </Link>
            )}
            <UserButton afterSignOutUrl="/" />
        </div>
      </>
    );
}
 
export default NavbarRoutes;