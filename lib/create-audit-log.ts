import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { prisma } from "./prisma";

interface Props {
    entityId: string;
    entityType: ENTITY_TYPE;
    entityTitle: string;
    action: ACTION;
}

export const createAuditLog = async (props: Props) => {
    try {
        const { orgId } = auth();
        const user = await currentUser();

        if (!user || !orgId) {
            throw new Error("User is not authenticated");
        }

        const {
            entityId,
            entityType,
            entityTitle,
            action
        } = props;

        await prisma.auditLog.create({
            data: {
                orgId,
                entityId,
                entityType,
                entityTitle,
                action,
                userId: user.id,
                userImage: user?.imageUrl,
                userName: user?.firstName + " " + user?.lastName
            }
        });

    } catch (error) {
        console.log("AUDIT_LOG_ERROR", error);
        throw new Error("Something went wrong while trying to create log");
    }
};