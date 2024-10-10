"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { CreateBoard } from "./schema";
import { InputType, ReturnType } from "./types";

import { prisma } from "@/lib/prisma";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { increaseAvailableCount, hasAvailbleCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { orgId, userId } = auth();
    
    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const canCreate = await hasAvailbleCount();
    const isPro = await checkSubscription();

    // Check if a user cannot create a board, and if the user is not subscribed. If true, return an error
    if (!canCreate && !isPro) {
        return {
            error: "You have reached your limit of free boards. Kindly upgrade your organization to create more."
        }
    }

    const { title, image } = data;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
    ] = image.split("|");

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: "Missing field. Failed to create board."
        }
    }

    let board;

    try {
        board = await prisma.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageLinkHTML,
                imageUserName
            }
        });

        // If the user is not subscribed, increase the available count to create boards
        if (!isPro) {
            await increaseAvailableCount();
        }

        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE
        });

    } catch (error) {
        console.log("Error creating board", error);
        return {
            error: "Failed to create."
        }
    }

    revalidatePath(`/board/${board.id}`);

    return {
        data: board
    }
};

export const createBoard = createSafeAction(CreateBoard, handler);
