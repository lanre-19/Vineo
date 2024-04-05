"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import { Grip, Pencil } from "lucide-react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd"
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

interface ChaptersListProps {
    items: Chapter[];
    onEdit: (id: string) => void;
    onReorder: (updateData: { id: string, position: number }[]) => void;
}

const ChaptersList = ({
    items,
    onReorder,
    onEdit
}: ChaptersListProps) => {
    const [hasMounted, setHasMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        setChapters(items);
    }, [items]);

    const onDragEnd = (result: DropResult) =>  {
        if (!result.destination) {
            return;
        }

        const items = Array.from(chapters);
        const [reorderedItems] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItems);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedChapters = items.slice(startIndex, endIndex + 1);

        setChapters(items);

        const bulkUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }));

        onReorder(bulkUpdateData);
    };

    if (!hasMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                        {chapters.map((chapter, i) => (
                            <Draggable
                              key={chapter.id}
                              draggableId={chapter.id}
                              index={i}
                            >
                                {(provided) => (
                                    <div
                                      {...provided.draggableProps}
                                      ref={provided.innerRef}
                                      className={cn(
                                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                        chapter.isPublished && "bg-blue-100 border-blue-200 text-blue-700"
                                    )}>
                                        <div
                                          {...provided.dragHandleProps}
                                          className={cn(
                                            "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                            chapter.isPublished && "border-r-blue-200 hover:bg-blue-200"
                                          )}
                                        >
                                            <Grip className="w-5 h-5" />
                                        </div>
                                        {chapter.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            {chapter.isFree && (
                                                <Badge>
                                                    Free
                                                </Badge>
                                            )}
                                            <Badge className={cn(
                                                "bg-slate-500",
                                                chapter.isPublished && "bg-blue-700"
                                            )}>
                                                {chapter.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            <Pencil
                                              onClick={() => onEdit(chapter.id)}
                                              className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
 
export default ChaptersList;