import { auth } from "@clerk/nextjs";

import { prisma } from "./prisma";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
    const { orgId } = auth();

    if (!orgId) {
        return false;
    }

    // Check for an organization subscription in the DB, and select the stripeSubId, stripeCustomerId, stripePriceId and the stripeCurrentEndPeriod
    const orgSubscription = await prisma.orgSubscription.findUnique({
        where: {
            orgId
        },
        select: {
            stripeSubscriptionId: true,
            stripeCustomerId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true
        }
    });

    if (!orgSubscription) {
        return false;
    }

    // Check the the priceId of a an organization' subscription, the subscription end period, and calculate the dayInMillisecond with the current date
    const isValid = orgSubscription.stripePriceId && orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !!isValid;
};