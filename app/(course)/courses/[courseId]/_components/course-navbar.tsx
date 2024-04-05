import NavbarRoutes from "@/components/navbar-routes";
import { Chapter, Course, UserProgress } from "@prisma/client";
import CourseMobileSidebar from "./course-mobile-sidebar";

interface CourseNavbarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}

const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
    return (
        <div className="flex items-center p-4 h-full border-b bg-white">
            <CourseMobileSidebar
              course={course}
              progressCount={progressCount}
            />
            <NavbarRoutes />
        </div>
    );
}
 
export default CourseNavbar;