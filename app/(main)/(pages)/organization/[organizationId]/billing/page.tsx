import SubButton from "./_components/sub-button";
import Info from "../_components/info";
import { Separator } from "@/components/ui/separator";

import { checkSubscription } from "@/lib/subscription";

const BillingPage = async () => {
    const isPro = await checkSubscription();
    return (
        <div
          className="w-full"
        >
            <h1
              className="text-3xl font-bold mb-7"
            >
                Billing
            </h1>
            <Info
              isPro={isPro}
            />
            <Separator
              className="my-4"
            />
            <p
              className="text-sm mb-3 text-muted-foreground font-normal"
            >
                Easily manage the subscription for your organization with the click of a button.
            </p>
            <SubButton
              isPro={isPro}
            />
        </div>
    );
}
 
export default BillingPage;