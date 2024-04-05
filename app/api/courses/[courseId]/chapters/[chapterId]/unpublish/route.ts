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

        const unpublishChapter = await prisma.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: false
            }
        });

        const publishedChaptersInCourse = await prisma.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            }
        });

        if (!publishedChaptersInCourse.length) {
            await prisma.course.update({
                where: {
                    id: courseId,
                    userId
                },
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(unpublishChapter);

    } catch (error) {
        console.log("[UNPUBLISH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};