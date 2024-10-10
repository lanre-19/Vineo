"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { CopyCard } from "./schema";
import { InputType, ReturnType } from "./types";

import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id, boardId } = data;

    let card;

    try {
        // Check for an existing card to copy
        const cardToCopy = await prisma.card.findUnique({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                }
            }
        });

        if (!cardToCopy) {
            return {
                error: "Card not found"
            }
        }

        // Check for the last modified card
        const lastCard = await prisma.card.findFirst({
            where: {
                listId: cardToCopy.listId
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true
            }
        });
        
        // Reorder the list of cards
        const newOrder = lastCard ? lastCard.order + 1 : 1;

        // Create a new card
        card = await prisma.card.create({
            data: {
                title: `${cardToCopy.title} - Copy`,
                description: cardToCopy.description,
                order: newOrder,
                listId: cardToCopy.listId
            }
        });

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE
        });

    } catch (error) {
        console.log("Error copying cards", error);
        return {
            error: "Failed to copy"
        }
    }

    revalidatePath(`/board/${boardId}`);

    return {
        data: card
    }
};

export const copyCard = createSafeAction(CopyCard, handler);