import { auth } from "@clerk/nextjs";

import { prisma } from "./prisma";
import { MAX_FREE_BOARDS } from "@/constants/boards";

export const increaseAvailableCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized");
    }

    // Check for existing org limit in an organization
    const orgLimit = await prisma.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    if (orgLimit) {
        // Update the orgLimit if it exists and increase it by 1
        await prisma.orgLimit.update({
            where: {
                orgId
            },
            data: {
                count: orgLimit.count + 1
            }
        });
    } else {
        // Create a new one if none exists with a default of 1
        await prisma.orgLimit.create({
            data: {
                orgId,
                count: 1
            }
        });
    }
};

export const decreaseAvailableCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized");
    }

    const orgLimit = await prisma.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    // Update the orgLimit in the DB if it exists and decrease it by 1
    if (orgLimit) {
        await prisma.orgLimit.update({
            where: {
                orgId
            },
            data: {
                count: orgLimit.count > 0 ? orgLimit.count - 1 : 0
            }
        });
    } else {
        // Create a new one if none exists with a default of 1
        await prisma.orgLimit.create({
            data: {
                orgId,
                count: 1
            }
        });
    }
};

export const hasAvailbleCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized");
    }

    // Fetch the organization limit for creating boards
    const orgLimit = await prisma.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
        return true;
    } else {
        return false;
    }
};

export const getAvailableCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        return 0;
    }

    // Fetch the organization limit for creating boards
    const orgLimit = await prisma.orgLimit.findUnique({
        where: {
            orgId
        }
    });

    if (!orgLimit) {
        return 0;
    }

    return orgLimit.count;
};