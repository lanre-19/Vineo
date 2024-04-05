import { Chapter, Attachment } from "@prisma/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

interface GetChapterProps {
    courseId: string;
    chapterId: string;
    userId: string;
}

export const getChapter = async ({
    courseId,
    chapterId,
    userId
}: GetChapterProps) => {
    try {
        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_courseId: {
                    courseId,
                    userId
                }
            }
        });

        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                isPublished: true
            },
            select: {
                price: true
            }
        });

        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            }
        });

        if (!course || !chapter) {
            throw new Error("Chapter and course were not found");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (purchase) {
            attachments = await prisma.attachment.findMany({
                where: {
                    courseId: courseId
                }
            });
        }

        if (chapter.isFree || purchase) {
            muxData = await prisma.muxData.findUnique({
                where: {
                    chapterId: chapterId
                }
            });

            nextChapter = await prisma.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position
                    }
                },
                orderBy: {
                    position: "asc"
                }
            });
        }

        const userProgress = await prisma.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase
        }

    } catch (error) {
        console.log("GET_CHAPTER", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null
        };
    }
};