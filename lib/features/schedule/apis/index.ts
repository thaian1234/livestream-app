import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { EventRouteType } from "@/server/api/routes/event.routes";

const baseApi = baseClient<EventRouteType>().events;
const baseKey = ["events"];

const keys = {
    events: baseKey,
};

export const eventApi = {
    query: {
        useGetAllEvents(username?: string) {
            const $get = baseApi.$get;
            return Fetcher.useHonoQuery($get, keys.events, {
                query: {
                    username,
                },
            });
        },
    },
    mutation: {
        useCreateEvent() {
            const $post = baseApi.$post;
            const { mutation, toast } = Fetcher.useHonoMutation($post, {
                onSuccess({ msg }) {
                    toast.success(msg);
                },
                onError(err) {
                    toast.error(err.message);
                },
            });
            return mutation;
        },
        useUpdateEvent() {
            const $patch = baseApi[":id"].$patch;
            const { mutation, toast } = Fetcher.useHonoMutation($patch, {
                onSuccess({ msg }) {
                    // toast.success(msg);
                },
                onError(err) {
                    toast.error(err.message);
                },
            });
            return mutation;
        },
        useDeleteEvent() {
            const $delete = baseApi[":id"].$delete;
            const { mutation, toast } = Fetcher.useHonoMutation($delete, {
                onSuccess({ msg }) {
                    toast.success(msg);
                },
            });
            return mutation;
        },
    },
};
