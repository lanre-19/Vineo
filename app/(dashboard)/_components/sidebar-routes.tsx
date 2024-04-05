"use client";

import { usePathname } from "next/navigation";
import { Compass, Layout, List, BarChart } from "lucide-react";

import SidebarItem from "./sidebar-item";

// Array of the routes or pages users can go to
const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search"
    },
];

// Array of the routes or pages users can go to in teacher mode
const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses"
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics"
    },
];

const SidebarRoutes = () => {
    const pathname = usePathname();
    
    // Teacher route
    const isTeacherPage = pathname?.includes("/teacher");

    // Dynamically checks if a user is in teacher page, then display routes for the page. If not, display another route
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                  key={route.href}
                  icon={route.icon}
                  label={route.label}
                  href={route.href}
                />
            ))}
        </div>
    );
}
 
export default SidebarRoutes;