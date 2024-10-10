import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let e: Stripe.Event;

    try {
        e = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        console.log("Error processing payment request", error);
        return new NextResponse("Webhook error", { status: 400 });
    }
    
    // Get the stripe checkout session event
    const session = e.data.object as Stripe.Checkout.Session;

    // Check if the stripe session is complete
    if (e.type === "checkout.session.completed") {
        // Retrieve stripe subscription
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.orgId) {
            return new NextResponse("Org ID is required", { status: 400 });
        }

        // Create a stripe subscription for an organization in the database
        await prisma.orgSubscription.create({
            data: {
                orgId: session?.metadata?.orgId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
            }
        });
    }

    // Check if the stripe payment was successful
    if (e.type === "invoice.payment_succeeded") {
        // Retrieve stripe subscription
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );
        
        // Update the organization's subscription in the database
        await prisma.orgSubscription.update({
            where: {
                stripeSubscriptionId: subscription.id
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
            }
        });
    }

    return new NextResponse(null, { status: 200 });
};