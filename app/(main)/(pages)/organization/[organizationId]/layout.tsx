import { auth } from "@clerk/nextjs";
import { startCase } from "lodash";

import OrgControl from "./_components/org-control";

interface OrganizationIdLayoutProps {
    children: React.ReactNode;
}

export async function generateMetaData() {
    const { orgSlug } = auth();

    return {
        title: startCase(orgSlug || "organization")
    }
};

const OrganizationIdLayout = ({ children }: OrganizationIdLayoutProps) => {
    return (
        <>
          {/* Remove the <OrgControl /> later if the issue persists */}
          <OrgControl />
          {children}
        </>
    );
}
 
export default OrganizationIdLayout;