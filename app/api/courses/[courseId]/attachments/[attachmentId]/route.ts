import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function DELETE (
    req: Request,
    { params }: { params: {
        courseId: string,
        attachmentId: string
    }}
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });
        
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await prisma.attachment.delete({
            where: {
                id: params.attachmentId,
                courseId: params.courseId
            }
        });

        return NextResponse.json(attachment);

    } catch (error) {
        console.log("[COURSE_ID_ATTACHMENTS]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};