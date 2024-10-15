import { Medal } from "lucide-react";
import Link from "next/link";

import { FlipWords } from "@/components/global/flip-words";
import Image from "next/image";

const LandingPage = () => {

  const words = ["Boost", "Improve", "Enhance", "Foster"];

    return (
        <main
          className="flex flex-col items-center justify-center"
        >
          <div
            className="flex flex-col items-center justify-center"
          >
            <div
              className="flex items-center p-4 mb-4 text-blue-700 bg-blue-100 border shadow-sm rounded-full uppercase"
            >
              <Medal
                className="w-6 h-6 mr-2"
              />
              No 1 task management
            </div>

            <h1
              className="text-5xl md:text-7xl text-center font-extrabold mb-6"
            >
              <FlipWords words={words} /> productivity with
              <br />
              <span
                className="underline"
              >
                Vineo
              </span>{" "}now.
            </h1>
          </div>

          <div
            className="text-sm md:text-xl text-neutral-600 m-4 max-w-xs md:max-w-2xl text-center mx-auto"
          >
            Collaborate, manage projects, tasks and reach new productivity peaks. From high rises to the home office, the way your team works is unique - accomplish it all with Vineo.
          </div>

          <Link
            href="/sign-up"
            className="relative inline-flex h-10 overflow-hidden rounded-lg p-[2px] mb-16 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span
              className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#6930c3_0%,#4361ee_50%,#b5179e_100%)]"
            />
            <span
              className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-transparent px-3 py-1 text-sm font-medium text-white backdrop-blur-2xl"
            >
              Get Started For Free
            </span>
          </Link>

          <div
            className="relative aspect-video bg-no-repeat bg-center bg-cover rounded-2xl w-[70%] h-[70%] p-2 overflow-hidden border-[2px] border-gray-400 mb-[100px]"
            style={{
              backgroundImage: `url("/images/vineo_screenshot.png")`
            }}
          />
        </main>
    );
}
 
export default LandingPage;