import { UserButton } from "@clerk/nextjs";

import {
    Book,
    Headphones,
    Search
} from "lucide-react";

import { Input } from "@/components/ui/input";

const InfoBar = () => {
    return (
        <div
          className="flex flex-row items-center justify-end gap-6 px-4 py-4 w-full dark:bg-black"
        >
            <span
              className="flex items-center gap-2 font-bold"
            >
                <p
                  className="text-sm font-light text-gray-300"
                >
                    Credits
                </p>
            </span>
            <span
              className="flex items-center rounded-full bg-muted px-4"
            >
                <Search />
                <Input
                  className="border-none bg-transparent"
                  placeholder="Quick Search"
                />
            </span>
            <UserButton
              afterSignOutUrl="/"
            />
        </div>
    );
}
 
export default InfoBar;