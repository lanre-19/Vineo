import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { cardId: string } }
) {
    try {
        const { userId, orgId } = auth();

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const card = await prisma.card.findUnique({
            where: {
                id: params.cardId,
                list: {
                    board: {
                        orgId
                    }
                }
            },
            include: {
                list: {
                    select: {
                        title: true
                    }
                }
            }
        });

        return NextResponse.json(card);

    } catch (error) {
        console.log("Error fetching card", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}