"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { DeleteBoard } from "./schema";
import { InputType, ReturnType } from "./types";

import { ActionState, createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { prisma } from "@/lib/prisma";
import { decreaseAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();
    const isPro = await checkSubscription();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id } = data;

    let board;

    try {
        board = await prisma.board.delete({
            where: {
                id,
                orgId
            }
        });

        if (!isPro) {
            await decreaseAvailableCount();
        }
        
        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE
        });

    } catch (error) {
        console.log("Error deleting board", error);
        return {
            error: "Failed to delete"
        }
    }

    revalidatePath(`/organization/${orgId}`);
    
    redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);