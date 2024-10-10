"use client";

import { ActivityIcon } from "lucide-react";
import { AuditLog } from "@prisma/client";

import ActivityItem from "@/components/global/activity-item";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityProps {
    items: AuditLog[];
}

const Activity = ({ items }: ActivityProps) => {
    return (
        <div
          className="flex items-start w-full gap-x-3"
        >
            <ActivityIcon
              className="w-5 h-5 text-neutral-700 mt-0.5"
            />
            <div
              className="w-full"
            >
                <p
                  className="text-neutral-700 font-semibold mb-2"
                >
                    Activity
                </p>
                <ol
                  className="mt-2 space-y-4"
                >
                    {items.map((item) => (
                        <ActivityItem
                          key={item.id}
                          data={item}
                        />
                    ))}
                </ol>
            </div>
        </div>
    );
}
 
export default Activity;

Activity.Skeleton = function ActivitySkeleton() {
    return (
        <div
          className="flex items-start w-full gap-x-3"
        >
            <Skeleton
              className="w-6 h-6 bg-neutral-200"
            />
            <div
              className="w-full"
            >
                <Skeleton
                  className="w-24 h-6 mb-2 bg-neutral-200"
                />
                <Skeleton
                  className="w-full h-10 bg-neutral-200"
                />
            </div>
        </div>
    )
};