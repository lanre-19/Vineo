"use client";

import { useState, useRef, ElementRef } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import ListHeader from "./list-header";
import CardForm from "./card-form";
import CardItem from "./card-item";

import { cn } from "@/lib/utils";
import { ListWithCards } from "@/types";

interface ListItemProps {
    data: ListWithCards;
    index: number;
}

const ListItem = ({
    data,
    index
}: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

    return (
        <Draggable
          draggableId={data.id}
          index={index}
        >
          {(provided) => (
            <li
              {...provided.draggableProps}
              ref={provided.innerRef}
              className="shrink-0 w-[272px] h-full select-none"
            >
                <div
                  {...provided.dragHandleProps}
                  className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
                >
                    <ListHeader
                      data={data}
                      onAddCard={enableEditing}
                    />
                    <Droppable
                      droppableId={data.id}
                      type="card"
                    >
                      {(provided) => (
                        <ol
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={cn(
                            "flex flex-col mx-1 px-1 py-0.5 gap-y-2",
                            data.cards.length > 0 ? "mt-2" : "mt-0"
                          )}
                        >
                          {data.cards.map((card, i) => (
                            <CardItem
                              key={card.id}
                              index={i}
                              data={card}
                            />
                          ))}
                          {provided.placeholder}
                      </ol>
                      )}
                    </Droppable>
                    <CardForm
                      ref={textareaRef}
                      listId={data.id}
                      isEditing={isEditing}
                      enableEditing={enableEditing}
                      disableEditing={disableEditing}
                    />
                </div>
            </li>
          )}
        </Draggable>
    );
}
 
export default ListItem;