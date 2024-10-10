"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Database,
    GitBranch,
    LucideMousePointer
} from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/global/mode-toggle";

import { menuOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <nav
          className="flex flex-col items-center justify-between dark:bg-black h-screen overflow-scroll gap-10 py-6 px-6"
        >
            <div
              className="flex flex-col items-center justify-center gap-8"
            >
                <Link
                  href="/"
                >
                  <Image
                    src="/zenflow-icon.png"
                    alt="Logo"
                    width={49}
                    height={49}
                  />
                </Link>
                <TooltipProvider>
                    {menuOptions.map((option, i) => (
                        <ul
                          key={i}
                        >
                            <Tooltip
                              delayDuration={0}
                            >
                                <TooltipTrigger>
                                    <li>
                                        <Link
                                          href={option.href}
                                          className={cn(
                                            "flex items-center justify-center group w-8 h-8 scale-[1.5] rounded-lg p-[3px] cursor-pointer",
                                            pathname === option.href && "bg-[#EEE0FF] dark:bg-[#2442c9]"
                                          )}
                                        >
                                            <option.Component
                                              selected={pathname === option.href}
                                            />
                                        </Link>
                                    </li>
                                </TooltipTrigger>
                                <TooltipContent
                                  className="bg-black/10 backdrop-blur-xl"
                                  side="right"
                                >
                                    <p>
                                      {option.name}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </ul>
                    ))}
                </TooltipProvider>
                <Separator />
                <div
                  className="flex items-center flex-col gap-9 dark:bg-[#353346]/30 py-4 px-2 rounded-full h-56 overflow-scroll border-[1px]"
                >
                    <div
                      className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]"
                    >
                        <LucideMousePointer
                          className="dark:text-white"
                          size={18}
                        />
                        <div
                          className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]"
                        />
                    </div>
                    <div
                      className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]"
                    >
                        <GitBranch
                          className="dark:text-white"
                          size={18}
                        />
                        <div
                          className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]"
                        />
                    </div>
                    <div
                      className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]"
                    >
                        <Database
                          className="dark:text-white"
                          size={18}
                        />
                        <div
                          className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]"
                        />
                    </div>
                    <div
                      className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]"
                    >
                        <GitBranch
                          className="dark:text-white"
                          size={18}
                        />
                    </div>
                </div>
            </div>
            {/* <div
              className="flex flex-col items-center justify-center gap-8"
            >
                <ModeToggle />
            </div> */}
        </nav>
    );
}
 
export default Sidebar;