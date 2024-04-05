"use client"

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
        return (
            <Button
              className="p-0 hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              size="sm"
              variant="ghost"
            >
                Title
                <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
        )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
        return (
            <Button
              className="p-0 hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              size="sm"
              variant="ghost"
            >
                Price
                <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
        )
    },
    cell: ({ row }) => {
        const price = parseFloat(row.getValue("price") || "0");
        const formattedPrice = new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN"
        }).format(price);

        return <div>{formattedPrice}</div>
    }
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
        return (
            <Button
              className="p-0 hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              size="sm"
              variant="ghost"
            >
                Published
                <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
        )
    },
    cell: ({ row }) => {
        const isPublished = row.getValue("isPublished") || false;

        return (
            <Badge className={cn(
                "bg-slate-500",
                isPublished && "bg-blue-700"
            )}>
                {isPublished ? "Published" : "Draft"}
            </Badge>
        )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
        const { id } = row.original;

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                      className="flex items-center w-4 h-4 p-0 hover:bg-transparent"
                      variant="ghost"
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href={`/teacher/courses/${id}`}>
                        <DropdownMenuItem className="cursor-pointer">
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  }
]
