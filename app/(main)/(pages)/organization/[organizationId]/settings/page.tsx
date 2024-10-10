import { OrganizationProfile } from "@clerk/nextjs";

const SettingsPage = () => {
    return (
        <div
          className="w-full mb-20"
        >
            <h1
              className="text-3xl font-bold mb-7"
            >
                Settings
            </h1>
            <OrganizationProfile
              appearance={{
                elements: {
                    rootBox: {
                        boxShadow: "none",
                        width: "100%"
                    },
                    card: {
                        border: "1px solid #e5e5e5",
                        boxShadow: "none",
                        width: "100%"
                    }
                }
              }}
            />
        </div>
    );
}
 
export default SettingsPage;