"use client";

import { CalendarEventExternal } from "@schedule-x/calendar";
import { format } from "date-fns";

import { eventApi } from "@/lib/features/schedule/apis";
import { Schedule } from "@/lib/features/schedule/components/schedule";

import { Spinner } from "@/components/ui/spinner";

export default function SchedulePage() {
    const { data, isPending } = eventApi.query.useGetAllEvents();

    if (isPending || !data) {
        return <Spinner size="large" />;
    }
    const events: CalendarEventExternal[] = data.data.map((event) => ({
        id: event.id,
        description: event?.description || "",
        location: event?.location || "",
        start: format(event.start, "yyyy-MM-dd HH:mm"),
        end: format(event.end, "yyyy-MM-dd HH:mm"),
        title: event.title,
    }));

    return (
        <article className="p-10">
            <Schedule events={events} />
        </article>
    );
}
