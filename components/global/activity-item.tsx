import { format } from "date-fns";
import { AuditLog } from "@prisma/client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { generateLogMessage } from "@/lib/generate-log-message";

interface ActivityItemProps {
    data: AuditLog;
}

const ActivityItem = ({ data }: ActivityItemProps) => {
    return (
        <li
          className="flex items-center gap-x-2"
        >
            <Avatar
              className="w-8 h-8"
            >
                <AvatarImage
                  src={data.userImage}
                />
            </Avatar>
            <div
              className="flex flex-col space-y-0.5"
            >
                <p
                  className="text-sm text-muted-foreground"
                >
                    <span
                      className="text-neutral-700 font-semibold lowercase"
                    >
                        {data.userName}
                    </span>{" "}
                    {generateLogMessage(data)}
                </p>
                <p
                  className="text-xs text-muted-foreground"
                >
                    {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
            </div>
        </li>
    );
}
 
export default ActivityItem;