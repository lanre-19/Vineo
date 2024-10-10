import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ActivityItem from "@/components/global/activity-item";
import { Skeleton } from "@/components/ui/skeleton";

import { prisma } from "@/lib/prisma";

const ActivityList = async () => {
    const { orgId } = auth();

    if (!orgId) {
        redirect("/select-org");
    }

    const auditLogs = await prisma.auditLog.findMany({
        where: {
            orgId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <ol
          className="space-y-4 mt-4"
        >
            <p
              className="hidden last:block text-xs text-center text-muted-foreground"
            >
                No activity was found in this organization
            </p>
            {auditLogs.map((log) => (
                <ActivityItem
                  key={log.id}
                  data={log}
                />
            ))}
        </ol>
    );
}
 
export default ActivityList;

ActivityList.Skeleton = function ActivityListSkeleton() {
    return (
        <ol
          className="space-y-4 mt-4"
        >
            <Skeleton
              className="w-[80%] h-14"
            />
            <Skeleton
              className="w-[50%] h-14"
            />
            <Skeleton
              className="w-[70%] h-14"
            />
            <Skeleton
              className="w-[80%] h-14"
            />
            <Skeleton
              className="w-[75%] h-14"
            />
        </ol>
    )
};