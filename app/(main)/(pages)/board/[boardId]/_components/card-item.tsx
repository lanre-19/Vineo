"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";

import { useCardModal } from "@/hooks/use-card-modal";

interface CardItemProps {
    index: number;
    data: Card;
}

const CardItem = ({
    index,
    data
}: CardItemProps) => {
  const cardModal = useCardModal();

    return (
        <Draggable
          draggableId={data.id}
          index={index}
        >
          {(provided) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              onClick={() => cardModal.onOpen(data.id)}
              className="text-sm px-3 py-2 bg-white border-2 border-transparent hover:border-blue-500 rounded-md shadow-sm truncate"
              role="button"
            >
              {data.title}
            </div>
          )}
        </Draggable>
    );
}
 
export default CardItem;