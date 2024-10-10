import { UserButton, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Footer = async () => {
    const user = await currentUser();

    return (
        <header
          className="flex items-center justify-between right-0 left-0 bottom-0 px-3 py-3 mb-0 backdrop-blur-lg z-[100] border-t-[1px] border-neutral-200"
        >
            <aside
              className="flex items-center gap-[2px]"
            >
                <Image
                    src="/vineo-logo-dark.svg"
                    alt="Logo"
                    width={70}
                    height={70}
                    className="shadow-sm hidden dark:block"
                />
                <Image
                    src="/vineo-logo.svg"
                    alt="Logo"
                    width={70}
                    height={70}
                    className="shadow-sm dark:hidden"
                />
                {/* <span
                  className="text-neutral-500 text-sm ml-2 items-center"
                >
                    &copy; All rights reserved. 2024.
                </span> */}
            </aside>
            {/* <nav
              className="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block"
            >
                <ul
                  className="flex items-center text-base gap-4 list-none"
                >
                    <li>
                        <Link
                          href="#"
                          className="text-zinc-300 hover:text-white"
                        >
                            Products
                        </Link>
                    </li>
                    <li>
                        <Link
                          href="#"
                          className="text-zinc-300 hover:text-white"
                        >
                            Pricing
                        </Link>
                    </li>
                    <li>
                        <Link
                          href="#"
                          className="text-zinc-300 hover:text-white"
                        >
                            Enterprise
                        </Link>
                    </li>
                </ul>
            </nav> */}
            <aside
              className="flex items-center gap-4"
            >
                <Link
                  href="#"
                  className="relative inline-flex h-10 overflow-hidden rounded-lg p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                    <span
                      className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-zinc-100"
                    />
                    <span
                      className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-white px-3 py-1 text-sm font-medium text-zinc-600 backdrop-blur-3xl"
                    >
                        Terms of use
                    </span>
                </Link>
                <Link
                  href="#"
                  className="relative inline-flex h-10 overflow-hidden rounded-lg p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                    <span
                      className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-zinc-100"
                    />
                    <span
                      className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-white px-3 py-1 text-sm font-medium text-zinc-600 backdrop-blur-3xl"
                    >
                        Privacy policy
                    </span>
                </Link>

                {user ? (
                  <UserButton
                    afterSignOutUrl="/"
                  />
                ) : null}

                {/* <ModeToggle
                /> */}
            </aside>
        </header>
    );
}
 
export default Footer;