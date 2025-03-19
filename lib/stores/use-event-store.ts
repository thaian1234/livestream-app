import { z } from "zod";
import { create } from "zustand";

import { EventDTO } from "@/server/api/dtos/event.dto";

export const eventFormSchema = EventDTO.insertSchema
    .omit({
        userId: true,
        streamId: true,
    })
    .extend({
        start: z.date(),
        end: z.date(),
    });

export type EventFormData = z.infer<typeof eventFormSchema>;

interface EventState {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
}

export const useEventStore = create<EventState>((set) => ({
    isOpen: false,
    currentEvent: undefined,
    setOpen: (open) => set({ isOpen: open }),
}));
