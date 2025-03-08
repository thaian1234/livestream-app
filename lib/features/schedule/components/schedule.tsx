import {
    CalendarEventExternal,
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from "@schedule-x/calendar";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import "@schedule-x/theme-shadcn/dist/index.css";
import { useState } from "react";

import { EventFormData, useEventStore } from "@/lib/stores/use-event-store";
import { parseVietnameseDateTime } from "@/lib/utils";

import { eventApi } from "../apis";
import { AddEventDialog } from "./add-event-dialog";

interface ScheduleProps {
    events: CalendarEventExternal[];
}

export function Schedule({ events }: ScheduleProps) {
    const [currentEvent, setCurrentEvent] = useState<
        EventFormData | undefined
    >();
    const setOpen = useEventStore((state) => state.setOpen);
    const eventMutation = eventApi.mutation.useUpdateEvent();

    const eventsService = useState(() => createEventsServicePlugin())[0];
    const eventModal = useState(() => createEventModalPlugin())[0];
    const dragAndDrop = useState(() => createDragAndDropPlugin())[0];
    const calendar = useNextCalendarApp({
        views: [
            createViewDay(),
            createViewWeek(),
            createViewMonthGrid(),
            createViewMonthAgenda(),
        ],
        events: [
            {
                id: "e09770d9-8cda-4ee6-8f65-e85c41343b1f",
                description: "oke",
                location: "",
                start: "2025-03-08 15:46",
                end: "2025-03-08 23:46",
                title: "New Event",
            },
        ],
        plugins: [eventsService, eventModal, dragAndDrop],
        theme: "shadcn",
        isResponsive: true,
        locale: "vi-VN",
        datePicker: {
            label: "Chọn ngày",
        },
        defaultView: "week",
        callbacks: {
            onClickDateTime(dateTime) {
                console.log("dateTime: ", dateTime);
                setCurrentEvent({
                    title: "New Event",
                    description: "This is a new event",
                    start: parseVietnameseDateTime(dateTime),
                    end: parseVietnameseDateTime(dateTime),
                });
                setOpen(true);
            },
            onEventUpdate(event) {
                eventMutation.mutate({
                    param: {
                        id: event.id.toString(),
                    },
                    json: {
                        start: parseVietnameseDateTime(event.start),
                        end: parseVietnameseDateTime(event.end),
                    },
                });
            },
        },
    });

    const handleCreateEvent = (newEvent: CalendarEventExternal) => {
        eventsService.add(newEvent);
        setCurrentEvent(undefined);
    };

    return (
        <ScheduleXCalendar
            calendarApp={calendar}
            customComponents={{
                headerContentRightAppend: () => (
                    <AddEventDialog
                        key={
                            currentEvent?.start.toISOString() ||
                            new Date().toISOString()
                        }
                        initialValues={currentEvent}
                        onCreateEvent={handleCreateEvent}
                    />
                ),
            }}
        />
    );
}
