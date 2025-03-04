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
import {
    ScheduleXCalendar,
    useCalendarApp,
    useNextCalendarApp,
} from "@schedule-x/react";
import "@schedule-x/theme-shadcn/dist/index.css";
import { format } from "date-fns";
import { useState } from "react";

import { EventFormData, useEventStore } from "@/lib/stores/use-event-store";

interface ScheduleProps {
    onSelectedEvent: (event: EventFormData) => void;
    selectedEvent: EventFormData | undefined;
    onOpenModal: (open: boolean) => void;
    onAddEvent: (dateTime: string) => EventFormData;
}

export function Schedule({
    onSelectedEvent,
    onOpenModal,
    onAddEvent,
}: ScheduleProps) {
    const eventsService = useState(() => createEventsServicePlugin())[0];
    const eventModal = useState(() => createEventModalPlugin())[0];
    const dragAndDrop = useState(() => createDragAndDropPlugin())[0];

    const calendar = useCalendarApp({
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
                const newEvent = onAddEvent(dateTime);
                eventsService.add({
                    id: "1",
                    title: newEvent.title,
                    description: newEvent.description,
                    start: format(newEvent.startDate, "yyyy-MM-dd HH:mm"),
                    end: format(newEvent.endDate, "yyyy-MM-dd HH:mm"),
                });
            },
        },
    });

    return (
        <ScheduleXCalendar
            calendarApp={calendar}
            customComponents={{
                headerContentRightAppend: () => <div className="px-11"></div>,
            }}
        />
    );
}
