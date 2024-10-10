import { Suspense } from "react";

import Info from "./_components/info";
import BoardList from "./_components/board-list";
import { Separator } from "@/components/ui/separator";

import { checkSubscription } from "@/lib/subscription";

const OrganizationIdPage = async () => {
  const isPro = await checkSubscription();

    return (
        <div
          className="w-full mb-20"
        >
            <h1
              className="text-3xl font-bold mb-7"
            >
                Boards
            </h1>
            <Info
              isPro={isPro}
            />
            <Separator
              className="my-4"
            />
            <div>
                <Suspense
                  fallback={<BoardList.Skeleton />}
                >
                    <BoardList />
                </Suspense>
            </div>
        </div>
    );
}
 
export default OrganizationIdPage;