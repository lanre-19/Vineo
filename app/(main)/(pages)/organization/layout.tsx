import Sidebar from "../_components/sidebar";

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
    return (
        <main
          className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto"
        >
            <div
              className="flex gap-x-7"
            >
                <div
                  className="hidden md:block w-64 shrink-0"
                >
                    <Sidebar />
                </div>
              {children}
            </div>
        </main>
    );
}
 
export default OrganizationLayout;