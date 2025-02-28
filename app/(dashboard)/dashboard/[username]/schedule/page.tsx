"use client";

import {
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
import { format } from "date-fns";
import { useState } from "react";

export default function SchedulePage() {
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
                id: "1",
                title: "Streaming now",
                start: "2025-02-28 10:00",
                end: "2025-02-28 15:00",
                people: ["Streamer", "Customer"],
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
                const threeHoursLater = new Date(dateTime);
                threeHoursLater.setHours(threeHoursLater.getHours() + 3);
                const formattedDate = format(
                    threeHoursLater,
                    "yyyy-MM-dd HH:mm",
                );

                eventsService.add({
                    id: "2",
                    title: "New event",
                    start: dateTime,
                    end: formattedDate,
                });
            },
            onBeforeEventUpdate(oldEvent, newEvent, $app) {
                console.log(oldEvent, newEvent, $app);
                return true;
            },
        },
    });

    return (
        <div className="p-10">
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    );
}
