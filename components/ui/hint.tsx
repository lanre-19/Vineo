import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import React from "react";

interface HintProps {
    children: React.ReactNode;
    description: string;
    side?: "top" | "bottom" | "left" | "right";
    sideOffest?: number;
}

const Hint = ({
    children,
    description,
    side,
    sideOffest
}: HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip
              delayDuration={0}
            >
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent
                  className="text-xs max-w-[220px] break-words"
                  side={side}
                  sideOffset={sideOffest}
                >
                    {description}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
 
export default Hint;