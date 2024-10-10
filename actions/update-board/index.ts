"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { UpdateBoard } from "./schema";
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

    const { title, id } = data;

    let board;

    try {
        board = await prisma.board.update({
            where: {
                id,
                orgId
            },
            data: {
                title
            }
        });

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.UPDATE
        });
    } catch (error) {
        console.log("Error updating board", error);
        return {
            error: "Failed to update"
        }
    }

    revalidatePath(`/board/${id}`);

    return {
        data: board
    }

};

export const updateBoard = createSafeAction(UpdateBoard, handler);