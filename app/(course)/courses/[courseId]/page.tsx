import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { prisma } from "@/lib/prisma";

interface CourseIdPageProps {
    params: {
        courseId: string;
    }
}

const CourseIdPage = async ({ params }: CourseIdPageProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const course = await prisma.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
    });

    if (!course) {
        return redirect("/");
    }

    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}
 
export default CourseIdPage;