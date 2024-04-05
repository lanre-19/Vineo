import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function PATCH (
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId, chapterId } = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!courseId) {
            return new NextResponse("Course ID was not found", { status: 404 });
        }

        if (!chapterId) {
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

        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            }
        });

        const muxData = await prisma.muxData.findUnique({
            where: {
                chapterId: chapterId
            }
        });

        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const publishChapter = await prisma.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishChapter);

    } catch (error) {
        console.log("[PUBLISH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};