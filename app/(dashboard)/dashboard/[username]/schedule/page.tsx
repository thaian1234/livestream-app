"use client";

import { CalendarEventExternal } from "@schedule-x/calendar";
import { format } from "date-fns";

import { eventApi } from "@/lib/features/schedule/apis";
import { Schedule } from "@/lib/features/schedule/components/schedule";
import { useUser } from "@/lib/hooks/use-user";

import { Spinner } from "@/components/ui/spinner";

export default function SchedulePage() {
    const { user } = useUser();
    const { data, isPending, isError } = eventApi.query.useGetAllEvents(
        user.username,
    );

    if (isPending || !data) {
        return <Spinner size="large" />;
    }
    if (isError) {
        return <div>Error</div>;
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
            <Schedule events={events} isOwner={true} />
        </article>
    );
}
