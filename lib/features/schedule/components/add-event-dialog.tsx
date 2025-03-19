"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarEventExternal } from "@schedule-x/calendar";
import { format, parse } from "date-fns";
import { vi } from "react-day-picker/locale";
import { useForm } from "react-hook-form";

import {
    EventFormData,
    eventFormSchema,
    useEventStore,
} from "@/lib/stores/use-event-store";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { eventApi } from "../apis";

interface AddEventDialogProps {
    initialValues?: EventFormData;
    onCreateEvent: (values: CalendarEventExternal) => void;
}

export function AddEventDialog({
    initialValues,
    onCreateEvent,
}: AddEventDialogProps) {
    const form = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: { ...initialValues, description: "" },
    });
    const eventMutation = eventApi.mutation.useCreateEvent();
    const { isOpen, setOpen } = useEventStore((state) => state);

    const onSubmit = form.handleSubmit(async (values) => {
        const newEvent = await eventMutation.mutateAsync({
            json: values,
        });
        if (!!newEvent.data) {
            onCreateEvent({
                ...newEvent.data,
                start: format(newEvent.data.start, "yyyy-MM-dd HH:mm"),
                end: format(newEvent.data.end, "yyyy-MM-dd HH:mm"),
            });
            setOpen(false);
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="gradient"
                    className="text-black-1"
                    type="button"
                >
                    Add Event
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new event.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Team Meeting"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Discuss project updates and next steps..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="start"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Start Date</FormLabel>
                                    <DateTimePicker
                                        locale={vi}
                                        value={field.value}
                                        displayFormat={{
                                            hour24: "PP HH:mm",
                                            hour12: "PP hh:mm",
                                        }}
                                        onChange={field.onChange}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="end"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>End Date</FormLabel>
                                    <DateTimePicker
                                        locale={vi}
                                        hourCycle={24}
                                        displayFormat={{
                                            hour24: "PP HH:mm",
                                            hour12: "PP hh:mm",
                                        }}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Conference Room A"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Create Event</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
