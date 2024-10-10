"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { CopyList } from "./schema";
import { InputType, ReturnType } from "./type";

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
        // Check for an existing list to copy
        const listToCopy = await prisma.list.findUnique({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },
            include: {
                cards: true
            }
        });
        
        if (!listToCopy) {
            return {
                error: "List not found"
            }
        }

        // Check for the last modified card
        const lastList = await prisma.list.findFirst({
            where: {
                boardId
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true
            }
        });

        // Reorder the list of cards
        const newOrder = lastList ? lastList.order + 1 : 1;

        // Checks if there are cards to copy in the list
        if (listToCopy.cards.length > 0) {
            // Proceed with creating the list if there are cards
            list = await prisma.list.create({
                data: {
                    boardId: listToCopy.boardId,
                    title: `${listToCopy.title} - Copy`,
                    order: newOrder,
                    cards: {
                        createMany: {
                            data: listToCopy.cards.map((card) => ({
                                title: card.title,
                                description: card.description,
                                order: card.order
                            }))
                        }
                    }
                },
                include: {
                    cards: true
                }
            });
        } else {
            // If there are no cards, create list without the cards
            list = await prisma.list.create({
                data: {
                    boardId: listToCopy.boardId,
                    title: `${listToCopy.title} - Copy`,
                    order: newOrder
                }
            });
        }

        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE
        });

    } catch (error) {
        console.log("Copy list error", error);
        return {
            error: "Failed to copy"
        }
    }

    revalidatePath(`/board/${boardId}`);

    return {
        data: list
    }

};

export const copyList = createSafeAction(CopyList, handler);