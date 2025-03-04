"use client";

import "@schedule-x/theme-shadcn/dist/index.css";
import { useState } from "react";

import { AddEventDialog } from "@/lib/features/schedule/components/add-event-dialog";
import { Schedule } from "@/lib/features/schedule/components/schedule";
import { EventFormData, useEventStore } from "@/lib/stores/use-event-store";

export default function SchedulePage() {
    const [currentEvent, setCurrentEvent] = useState<
        EventFormData | undefined
    >();
    const setOpen = useEventStore((state) => state.setOpen);

    const handleAddEvent = (dateTime: string) => {
        const newEvent: EventFormData = {
            title: "New Event",
            description: "This is a new event",
            startDate: new Date(dateTime),
            endDate: new Date(dateTime),
        };
        setCurrentEvent(newEvent);
        setOpen(true);
        return newEvent;
    };

    return (
        <article className="relative p-10">
            <div className="absolute right-12 top-14 z-50">
                <AddEventDialog
                    initialValues={currentEvent}
                    key={currentEvent?.startDate.toISOString()}
                />
            </div>
            <Schedule
                selectedEvent={currentEvent}
                onSelectedEvent={setCurrentEvent}
                onOpenModal={setOpen}
                onAddEvent={handleAddEvent}
            />
        </article>
    );
}
