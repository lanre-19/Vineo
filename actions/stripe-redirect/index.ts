"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { StripeRedirect } from "./schema";
import { InputType, ReturnType } from "./types";

import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();
    const user = await currentUser();

    if (!userId || !orgId || !user) {
        return {
            error: "Unauthorized"
        }
    }

    const settingUrl = absoluteUrl(`/organization/${orgId}`);

    let url = "";

    try {
        // Check for and existing subscription for an organization
        const orgSubscription = await prisma.orgSubscription.findUnique({
            where: {
                orgId
            }
        });

        // If the organization subscription exists, and there is a stripe customer, create a stripe
        if (orgSubscription && orgSubscription.stripeCustomerId) {
            // Get the stripe session and set the url to the stripe session's url
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: orgSubscription.stripeCustomerId,
                return_url: settingUrl
            });

            url = stripeSession.url;
        } else {
            // Create a new stripe checkout session
            const stripeSession = await stripe.checkout.sessions.create({
                success_url: settingUrl,
                cancel_url: settingUrl,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: user.emailAddresses[0].emailAddress,
                line_items: [
                    {
                        price_data: {
                            currency: "USD",
                            product_data: {
                                name: "Vineo Pro",
                                description: "Unlimited boards for your organization."
                            },
                            unit_amount: 500,
                            recurring: {
                                interval: "month"
                            }
                        },
                        quantity: 1
                    }
                ],
                metadata: {
                    orgId
                }
            });

            url = stripeSession.url || "";
        }
    } catch (error) {
        console.log("Error processing subscription", error);
        return {
            error: "Something went wrong"
        }
    }

    revalidatePath(`/organization/${orgId}`);

    return {
        data: url
    }
};

export const stripeRedirect = createSafeAction(StripeRedirect, handler);
