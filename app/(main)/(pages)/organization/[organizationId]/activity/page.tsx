import { Suspense } from "react";

import Info from "../_components/info"
import ActivityList from "./_components/activity-list";
import { Separator } from "@/components/ui/separator";
import { checkSubscription } from "@/lib/subscription";

const ActivityPage = async () => {
  const isPro = await checkSubscription();
  
    return (
        <div
          className="w-full mb-20"
        >
            <h1
              className="text-3xl font-bold mb-7"
            >
                Activity
            </h1>
            <Info
              isPro={isPro}
            />
            <Separator
              className="my-4"
            />
            <Suspense
              fallback={<ActivityList.Skeleton />}
            >
                <ActivityList />
            </Suspense>
        </div>
    );
}
 
export default ActivityPage;