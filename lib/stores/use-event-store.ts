import { format } from "date-fns";
import { z } from "zod";
import { create } from "zustand";

export const eventFormSchema = z.object({
    title: z.string().min(2, {
        message: "Event name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    location: z.string().optional(),
    startDate: z.date({
        required_error: "Start date is required.",
    }),
    endDate: z.date({
        required_error: "End date is required.",
    }),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

interface EventState {
    currentEvent?: EventFormData;
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    createEvent: (data: EventFormData) => void;
    setCurrentEvent: (event: EventFormData) => void;
}

export const useEventStore = create<EventState>((set) => ({
    isOpen: false,
    currentEvent: undefined,
    setOpen: (open) => set({ isOpen: open }),
    createEvent: (data) => {
        const fullStartDate = format(data.startDate, "yyyy-MM-dd HH:mm");
        const fullEndDate = format(data.startDate, "yyyy-MM-dd HH:mm");

        const event = {
            name: data.title,
            description: data.description,
            location: data.location,
            startDateTime: fullStartDate,
            endDateTime: fullEndDate,
        };

        console.log("Event created:", event);
        // Here you would typically save the event to your backend or state
    },
    setCurrentEvent: (event) => set({ currentEvent: event }),
}));
