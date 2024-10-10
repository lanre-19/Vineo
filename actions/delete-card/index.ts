"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { DeleteCard } from "./schema";
import { InputType, ReturnType } from "./types";

import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { prisma } from "@/lib/prisma";

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
        card = await prisma.card.delete({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                }
            }
        });

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.DELETE
        });

    } catch (error) {
        console.log("Error deleting card", error);
        return {
            error: "Failed to delete"
        }
    }

    revalidatePath(`/board/${boardId}`);

    return {
        data: card
    }
};

export const deleteCard = createSafeAction(DeleteCard, handler);