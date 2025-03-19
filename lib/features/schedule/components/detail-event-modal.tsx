import { CalendarEvent } from "@schedule-x/calendar";
import { TimerIcon, Trash2Icon } from "lucide-react";
import React from "react";
import { BsTextIndentLeft } from "react-icons/bs";
import { MdLocationCity, MdPeople } from "react-icons/md";

import { Button } from "@/components/ui/button";

interface DetailEventModalProps {
    event: CalendarEvent;
    isOwner: boolean;
    onDeleteEvent: (id: string) => void;
}

export default function DetailEventModal({
    event,
    isOwner = false,
    onDeleteEvent,
}: DetailEventModalProps) {
    return (
        <article className="border-1 relative rounded-md bg-slate-200 px-2 py-4 shadow-lg">
            {isOwner && (
                <div className="absolute right-2 top-2">
                    <Button
                        size={"icon"}
                        onClick={() => onDeleteEvent(event.id.toString())}
                    >
                        <Trash2Icon fill="red" />
                    </Button>
                </div>
            )}
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                    <BsTextIndentLeft />
                    <h3 className="text-lg first-letter:uppercase">
                        {event.title}
                    </h3>
                </div>
                <div className="flex items-center space-x-2">
                    <TimerIcon className="size-4" />
                    <p className="text-sm font-light">{event.start}</p>
                </div>
                {event?.location && (
                    <div className="flex items-center space-x-2">
                        <MdLocationCity />
                        <p className="text-sm">{event.location}</p>
                    </div>
                )}
                {event?.people && (
                    <div className="flex items-center space-x-2">
                        <MdPeople />
                        <p className="text-sm">{event.people.join(", ")}</p>
                    </div>
                )}
            </div>
        </article>
    );
}
