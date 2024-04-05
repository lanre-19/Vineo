import { IconBadge } from "@/components/icon-badge";
import { LucideIcon, icons } from "lucide-react";

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    numberOfItems: number;
    variant?: "default" | "success";
}

const InfoCard = ({
    icon: Icon,
    label,
    numberOfItems,
    variant
}: InfoCardProps) => {
    return (
        <div className="flex items-center gap-x-2 p-3 border rounded-md">
            <IconBadge
              icon={Icon}
              variant={variant}
            />
            <div>
                <p className="font-medium">
                    {label}
                </p>
                <p className="text-gray-500 text-sm">
                    {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
                </p>
            </div>
        </div>
    );
}
 
export default InfoCard;