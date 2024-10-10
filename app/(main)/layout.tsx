import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import ModalProvider from "@/providers/modal-provider";
import QueryProvider from "@/providers/query-provider";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        signIn: {
          elements: {
            card: {
              boxShadow: "none",
            },
          },
        },
        signUp: {
          elements: {
            card: {
              boxShadow: "none",
            },
          },
        },
        organizationList: {
          elements: {
            card: {
              boxShadow: "none",
            },
          },
        },
      }}
    >
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};

export default MainLayout;
