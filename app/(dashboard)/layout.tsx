import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="h-full">
            {/* Navbar */}
            <div className="h-[70px] md:pl-56 fixed inset-y-0 w-full z-50">
                <Navbar />
            </div>

            {/* Sidebar */}
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>

            {/* Children of the Layout.tsx page */}
            <main className="md:pl-56 pt-[70px] h-full">
              {children}
            </main>
        </div>
    );
}
 
export default DashboardLayout;