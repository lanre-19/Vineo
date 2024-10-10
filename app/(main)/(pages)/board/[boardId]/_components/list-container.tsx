"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import ListItem from "./list-item";
import ListForm from "./list-form";

import { ListWithCards } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

function reorder<T>(
    list: T[],
    startIndex: number,
    endIndex: number
) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

const ListContainer = ({
    data,
    boardId
}: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data);

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List reordered");
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Card reordered");
        },
        onError: (error) => {
            toast.error(error);
        }
    });
    
    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const onDragEnd = (result: any) => {
        const {
            destination,
            source,
            type
        } = result;

        if (!destination) {
            return;
        }

        // If dropped in the same position/location
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // If user moves a list
        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index
            ).map((item, i) => ({ ...item, order: i }));

            setOrderedData(items);
            executeUpdateListOrder({
                items,
                boardId
            });
        }

        // If user moves a card
        if (type === "card") {
            let newOrderedData = [...orderedData];

            // Source and destination list
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destinationList = newOrderedData.find(list => list.id === destination.droppableId);
            
            if (!sourceList || !destinationList) {
                return;
            }

            // Check if cards exist on the sourcelist and set it to an empty array if true
            if (!sourceList.cards) {
                sourceList.cards = [];
            }

            // Check if cards exist on the destinationList
            if (!destinationList.cards) {
                destinationList.cards = [];
            }

            // Move cards in the same list
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                );

                reorderedCards.forEach((card, i) => {
                    card.order = i
                });

                sourceList.cards = reorderedCards;

                setOrderedData(newOrderedData);
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: reorderedCards
                });
                // Move cards to another list
            } else {
                // Remove card from the sourcelist
                const [movedCard] = sourceList.cards.splice(source.index, 1);

                // Assign/match the new listId to the moved card
                movedCard.listId = destination.droppableId;

                // Add card to the destination list
                destinationList.cards.splice(destination.index, 0, movedCard);

                // Update the order for each card in the source list
                sourceList.cards.forEach((card, i) => {
                    card.order = i;
                });

                // Update the order for each card in the destination list
                destinationList.cards.forEach((card, i) => {
                    card.order = i;
                });

                setOrderedData(newOrderedData);
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: destinationList.cards
                });
            }
        }
    };

    return (
        <DragDropContext
          onDragEnd={onDragEnd}
        >
          <Droppable
            droppableId="lists"
            type="list"
            direction="horizontal"
          >
            {(provided) => (
              <ol
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex gap-x-3 h-full"
              >
                  {orderedData.map((list, i) => {
                      return (
                          <ListItem
                            key={list.id}
                            data={list}
                            index={i}
                          />
                      )
                  })}
                  {provided.placeholder}
                  <ListForm/>
                  <div
                    className="flex-shrink-0 w-1"
                  />
              </ol>
            )}
          </Droppable>
        </DragDropContext>
    );
}
 
export default ListContainer;