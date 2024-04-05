import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function PATCH (
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!courseId) {
            return new NextResponse("Course ID was not found", { status: 404 });
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unpublishCourse = await prisma.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                isPublished: false
            }
        });

        return NextResponse.json(unpublishCourse);

    } catch (error) {
        console.log("[UNPUBLISH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};