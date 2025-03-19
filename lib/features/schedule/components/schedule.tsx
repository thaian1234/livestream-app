import {
    CalendarEvent,
    CalendarEventExternal,
    PluginBase,
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
import DetailEventModal from "./detail-event-modal";

interface ScheduleProps {
    events: CalendarEventExternal[];
    isOwner: boolean;
}

export function Schedule({ events, isOwner = false }: ScheduleProps) {
    const [currentEvent, setCurrentEvent] = useState<
        EventFormData | undefined
    >();
    const setOpen = useEventStore((state) => state.setOpen);
    const updateEventMutation = eventApi.mutation.useUpdateEvent();
    const deleteEventMutation = eventApi.mutation.useDeleteEvent();

    const eventsService = useState(() => createEventsServicePlugin())[0];
    const eventModal = useState(() => createEventModalPlugin())[0];
    const dragAndDrop = useState(() => createDragAndDropPlugin())[0];
    const plugins: PluginBase<string>[] = [eventsService, eventModal];
    if (isOwner) {
        plugins.push(dragAndDrop);
    }
    const calendar = useNextCalendarApp({
        views: [
            createViewDay(),
            createViewWeek(),
            createViewMonthGrid(),
            createViewMonthAgenda(),
        ],
        events: events,
        plugins: plugins,
        theme: "shadcn",
        isResponsive: true,
        locale: "vi-VN",
        datePicker: {
            label: "Chọn ngày",
        },
        defaultView: "week",
        callbacks: {
            onClickDateTime(dateTime) {
                if (!isOwner) return;
                setCurrentEvent({
                    title: "New Event",
                    description: "This is a new event",
                    start: parseVietnameseDateTime(dateTime),
                    end: parseVietnameseDateTime(dateTime),
                });
                setOpen(true);
            },
            onEventUpdate(event) {
                if (!isOwner) return;
                updateEventMutation.mutate({
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
        if (!isOwner) return;
        eventsService.add(newEvent);
        setCurrentEvent(undefined);
    };

    const handleDeleteEvent = (id: string) => {
        if (!isOwner) return;
        eventsService.remove(id);
        deleteEventMutation.mutate({
            param: {
                id: id,
            },
        });
    };

    return (
        <ScheduleXCalendar
            calendarApp={calendar}
            customComponents={{
                headerContentRightAppend: () =>
                    isOwner ? (
                        <AddEventDialog
                            key={
                                currentEvent?.start.toISOString() ||
                                new Date().toISOString()
                            }
                            initialValues={currentEvent}
                            onCreateEvent={handleCreateEvent}
                        />
                    ) : (
                        <></>
                    ),
                eventModal: ({ calendarEvent }) => (
                    <DetailEventModal
                        event={calendarEvent as CalendarEvent}
                        isOwner={isOwner}
                        onDeleteEvent={handleDeleteEvent}
                    />
                ),
            }}
        />
    );
}
