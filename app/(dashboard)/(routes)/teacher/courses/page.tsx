import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

import { prisma } from "@/lib/prisma";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await prisma.course.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

    return (
        <div className="p-6">
          <DataTable columns={columns} data={course} />
        </div>
    );
}
 
export default CoursesPage;