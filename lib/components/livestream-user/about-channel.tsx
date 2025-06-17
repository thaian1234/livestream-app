"use client";

import { CalendarEventExternal } from "@schedule-x/calendar";
import { format, isAfter, parseISO } from "date-fns";
import { Calendar, Clock, Info, MapPin } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { eventApi } from "@/lib/features/schedule/apis";

import { UserDTO } from "@/server/api/dtos/user.dto";

import { Spinner } from "@/components/ui/spinner";

import { TooltipModel } from "@/components/tooltip-model";

type ParamsType = {
    username: string;
};
interface AboutChannelProps {
    user: UserDTO.Select;
}
export function AboutChannel({ user }: AboutChannelProps) {
    const params = useParams<ParamsType>();
    const { data, isPending, isError } = eventApi.query.useGetAllEvents(
        params?.username || "",
    );
    const [isEditingSchedule, setIsEditingSchedule] = useState(false);

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

    // Get the next upcoming event
    const now = new Date();
    const upcomingEvents = events
        .filter((event) => isAfter(parseISO(event.start), now))
        .sort(
            (a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime(),
        );

    const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

    // Format date for display
    const formatEventDate = (dateString: string) => {
        const date = parseISO(dateString);
        return format(date, "dd MMMM yyyy");
    };

    // Format time for display
    const formatEventTime = (dateString: string) => {
        const date = parseISO(dateString);
        return format(date, "HH:mm");
    };

    // Group events by date
    const eventsByDate = events.reduce(
        (acc: Record<string, CalendarEventExternal[]>, event) => {
            const dateKey = format(parseISO(event.start), "yyyy-MM-dd");
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(event);
            return acc;
        },
        {},
    );
    return (
        <div className="mt-4 space-y-5 rounded-lg border border-gray-800 bg-gradient-to-br from-gray-800 to-gray-900 p-4">
            {user.bio !== null && (
                <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-200">
                        About Channel
                    </h3>
                    <p className="text-sm text-gray-300">{user.bio}</p>
                </div>
            )}

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Clock size={18} className="text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-200">
                        Livestream Schedule
                    </h3>
                </div>
                {nextEvent && (
                    <div className="mb-4 rounded border border-gray-700 bg-[#12141d] p-3">
                        <div className="mb-2 flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500"></div>
                            <span className="text-sm font-medium text-gray-300">
                                Upcoming Events
                            </span>
                        </div>
                        <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                            <div>
                                <h4 className="text-base font-medium text-gray-200">
                                    {nextEvent.title}
                                </h4>
                                <p className="text-xs text-gray-400">
                                    {formatEventDate(nextEvent.start)} •{" "}
                                    {formatEventTime(nextEvent.start)} -{" "}
                                    {formatEventTime(nextEvent.end)}
                                </p>
                            </div>
                            {nextEvent.location && (
                                <div className="mt-1 flex items-center gap-1 text-xs text-gray-400 sm:mt-0">
                                    <MapPin size={12} />
                                    <span>{nextEvent.location}</span>
                                </div>
                            )}
                        </div>
                        {nextEvent.description && (
                            <p className="mt-2 border-t border-gray-700 pt-2 text-xs text-gray-400">
                                {nextEvent.description}
                            </p>
                        )}
                    </div>
                )}
                <div className="space-y-4">
                    {Object.entries(eventsByDate).length > 0 ? (
                        Object.entries(eventsByDate)
                            .sort(([dateA], [dateB]) =>
                                dateA.localeCompare(dateB),
                            )
                            .map(([date, events]) => (
                                <div
                                    key={date}
                                    className="border-b border-gray-800 pb-3 last:border-b-0 last:pb-0"
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        <Calendar
                                            size={14}
                                            className="text-gray-400"
                                        />
                                        <h4 className="text-sm font-medium text-gray-300">
                                            {formatEventDate(events[0].start)}
                                        </h4>
                                    </div>
                                    <div className="space-y-2">
                                        {events.map((event) => (
                                            <div
                                                key={event.id}
                                                className={`rounded p-2 ${isEditingSchedule ? "border border-gray-700 bg-[#12141d]" : ""}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-2">
                                                        <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500"></div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-gray-200">
                                                                    {
                                                                        event.title
                                                                    }
                                                                </span>
                                                                <TooltipModel
                                                                    content={
                                                                        event.description ||
                                                                        "No description"
                                                                    }
                                                                    side="bottom"
                                                                >
                                                                    <button className="text-gray-400 hover:text-gray-300">
                                                                        <Info
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    </button>
                                                                </TooltipModel>
                                                            </div>
                                                            <div className="text-xs text-gray-400">
                                                                {formatEventTime(
                                                                    event.start,
                                                                )}{" "}
                                                                -{" "}
                                                                {formatEventTime(
                                                                    event.end,
                                                                )}
                                                                {event.location && (
                                                                    <span className="ml-2">
                                                                        •{" "}
                                                                        {
                                                                            event.location
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p className="text-center text-sm text-gray-400">
                            No events scheduled yet
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
