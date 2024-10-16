"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { DeleteList } from "./schema";
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

    let list;

    try {
        list = await prisma.list.delete({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            }
        });

        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.DELETE
        });

    } catch (error) {
        console.log("Error deleting list", error);
        return {
            error: "Failed to delete"
        }
    }

    revalidatePath(`/board/${boardId}`);

    return {
        data: list
    }

};

export const deleteList = createSafeAction(DeleteList, handler);