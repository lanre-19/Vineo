import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getProgress } from "@/actions/get-progess";
import CourseSidebar from "./_components/course-sidebar";
import CourseNavbar from "./_components/course-navbar";

interface CourseLayoutProps {
    children: React.ReactNode;
    params: {
        courseId: string;
    }
}

const CourseLayout = async ({ children, params }: CourseLayoutProps) => {
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
                include: {
                    userProgress: {
                        where: {
                            userId
                        }
                    }
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

    const progressCount = await getProgress(userId, course.id);

    return (
        <div className="h-full">
            <div className="h-[89px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                  course={course}
                  progressCount={progressCount}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                  course={course}
                  progressCount={progressCount}
                />
            </div>
            <main className="md:pl-80 pt-[89px] h-full">
               {children}
            </main>
        </div>
    );
}
 
export default CourseLayout;