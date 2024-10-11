import { auth } from "@clerk/nextjs";
import { redirect, notFound } from "next/navigation";

import BoardNavbar from "./_components/board-navbar";

import { prisma } from "@/lib/prisma";

interface BoardIdLayoutProps {
    children: React.ReactNode;
    params: {
        boardId: string;
    }
}

export async function generateMetadata({ params }: { params: { boardId: string } }) {
    const { orgId } = auth();

    if (!orgId) {
        return {
            title: "Board",
        };
    }

    // Fetch a board from the DB
    const board = await prisma.board.findUnique({
        where: {
            id: params.boardId,
            orgId: orgId,
        },
    });

    return {
        title: board?.title || "Board",
    };
}

const BoardIdLayout = async ({ children, params }: { children: React.ReactNode, params: { boardId: string }}) => {
    const { orgId } = auth();

    if (!orgId) {
        return redirect("/select-org");
    }

    const board = await prisma.board.findUnique({
        where: {
            id: params.boardId,
            orgId: orgId
        }
    });

    if (!board) {
        notFound();
    }

    return (
        <div
          className="relative h-full bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(${board.imageFullUrl})`
          }}
        >
            <BoardNavbar
              data={board}
            />
            <div
              className="absolute inset-0 bg-black/10"
            />
            <main
              className="relative pt-28 h-full"
            >
                {children}
            </main>
        </div>
    );
}
 
export default BoardIdLayout;