"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Initial state - shuffled
const INITIAL_STEPS = [
    { id: "step-3", content: "Funk-Magnetkontakte anlernen", order: 3 },
    { id: "step-1", content: "Zentrale (WiPro III) an CAN-Bus anschließen", order: 1 },
    { id: "step-4", content: "Systemtest durchführen", order: 4 },
    { id: "step-2", content: "Spannungsversorgung (12V) herstellen", order: 2 },
];

const SortableItem = ({
    id,
    content,
    isCorrectPosition,
    showValidation,
}: {
    id: string;
    content: string;
    isCorrectPosition?: boolean;
    showValidation: boolean;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-5 mb-3 bg-background border-2 rounded-xl flex items-center gap-4 cursor-grab active:cursor-grabbing shadow-sm hover:border-brand-sky/50 transition-colors ${showValidation
                ? isCorrectPosition
                    ? "border-brand-lime/50 bg-brand-lime/5"
                    : "border-brand-red/50 bg-brand-red/5"
                : "border-border"
                }`}
        >
            <div className="text-muted-foreground/50 flex flex-col gap-1.5 cursor-grab">
                <div className="w-6 h-1 bg-current rounded-full"></div>
                <div className="w-6 h-1 bg-current rounded-full"></div>
                <div className="w-6 h-1 bg-current rounded-full"></div>
            </div>
            <span className="font-bold text-foreground text-sm sm:text-base">{content}</span>

            {showValidation && (
                <div className="ml-auto text-2xl">{isCorrectPosition ? "✅" : "❌"}</div>
            )}
        </div>
    );
};

export function DragAndDropQuiz() {
    const [items, setItems] = useState(INITIAL_STEPS);
    const [isValidated, setIsValidated] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const addXp = useUserStore((state) => state.addXp);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        setIsValidated(false); // Reset validation on drag
    };

    const validateOrder = () => {
        setIsValidated(true);
        const isAllCorrect = items.every((item, index) => item.order === index + 1);
        if (isAllCorrect && xpEarned === 0) {
            setXpEarned(30);
            addXp(30);
        }
    };

    const isAllCorrect = isValidated && items.every((item, index) => item.order === index + 1);

    return (
        <Card className="border-border bg-muted/10 p-0 overflow-hidden max-w-3xl mx-auto w-full">
            <div className="p-6 md:p-8 flex justify-between items-start mb-2 border-b border-border bg-background">
                <div>
                    <Badge variant="secondary" className="mb-3 bg-brand-sky/10 text-brand-sky hover:bg-brand-sky/20">
                        Sortierungs-Szenario
                    </Badge>
                    <h3 className="text-2xl font-bold text-brand-navy">Montage-Reihenfolge</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Bringen Sie die Einbauschritte der WiPro III in die richtige Reihenfolge (Drag & Drop).
                    </p>
                </div>
                <div className="text-right hidden sm:block">
                    <span className="text-lg text-brand-sky font-extrabold">+30 XP</span>
                </div>
            </div>

            <div className="max-w-xl mx-auto py-8 px-4 md:px-0">
                {isMounted ? (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                            {items.map((item, index) => (
                                <SortableItem
                                    key={item.id}
                                    id={item.id}
                                    content={item.content}
                                    showValidation={isValidated}
                                    isCorrectPosition={item.order === index + 1}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="flex flex-col gap-3 opacity-50">
                        {items.map((item) => (
                            <div key={item.id} className="p-5 bg-background border-2 rounded-xl flex items-center gap-4 border-border">
                                <div className="text-muted-foreground/50 flex flex-col gap-1.5">
                                    <div className="w-6 h-1 bg-current rounded-full"></div>
                                    <div className="w-6 h-1 bg-current rounded-full"></div>
                                    <div className="w-6 h-1 bg-current rounded-full"></div>
                                </div>
                                <span className="font-bold text-foreground text-sm sm:text-base">{item.content}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-10 flex flex-col items-center">
                    {isAllCorrect ? (
                        <Badge className="text-base py-3 px-8 animate-fade-in bg-brand-lime text-brand-navy hover:bg-brand-lime border-none shadow-md">
                            Perfekt! +30 XP
                        </Badge>
                    ) : (
                        <Button size="lg" onClick={validateOrder} className="w-full sm:w-auto px-10 py-6 text-lg">
                            Reihenfolge prüfen
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
