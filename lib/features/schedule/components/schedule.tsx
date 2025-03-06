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

import { AddEventDialog } from "./add-event-dialog";

export function Schedule() {
    const [currentEvent, setCurrentEvent] = useState<
        EventFormData | undefined
    >();
    const setOpen = useEventStore((state) => state.setOpen);

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
        events: [],
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
                setOpen(true);
                setCurrentEvent({
                    title: "New Event",
                    description: "This is a new event",
                    startDate: new Date(dateTime),
                    endDate: new Date(dateTime),
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
                        key={currentEvent?.startDate.toISOString()}
                        initialValues={currentEvent}
                        onCreateEvent={handleCreateEvent}
                    />
                ),
            }}
        />
    );
}
