import { OrganizationSwitcher, UserButton, currentUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Image from "next/image";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import FormPopover from "@/components/form/form-popover";
import MobileSidebar from "./mobile-sidebar";

const Navbar = async () => {
  return (
    <header className="flex items-center fixed z-50 right-0 left-0 top-0 px-4 py-4 backdrop-blur-lg bg-white border-b-[1px] border-neutral-200">
      <MobileSidebar />
      <aside className="flex items-center gap-x-6">
        <Link
          href="/"
        >
          <Image
            src="/vineo-logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className="shadow-sm hidden md:flex"
          />
        </Link>
        <FormPopover
          align="start"
          side="bottom"
          sideOffset={18}
        >
          <Button
            className="hidden md:block text-base font-semibold tracking-wider bg-[#3f37c9] hover:bg-[#3832b5] px-2 py-1.5 rounded-lg"
            size="sm"
          >
            Create
          </Button>
        </FormPopover>
        <FormPopover
          align="start"
          side="bottom"
          sideOffset={18}
        >
          <Button
            className="block md:hidden text-lg font-semibold bg-[#3f37c9] hover:bg-[#3832b5] px-2 py-1.5 rounded-lg"
            size="sm"
          >
            <Plus />
          </Button>
        </FormPopover>
      </aside>

      <aside className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                width: 30,
                height: 30,
              },
            },
          }}
        />
      </aside>
    </header>
  );
};

export default Navbar;
