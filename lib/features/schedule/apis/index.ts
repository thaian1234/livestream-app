import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const baseApi = client.api.events;
const baseKey = ["events"];

const keys = {
    events: baseKey,
};

export const eventApi = {
    query: {
        useGetAllEvents() {
            const $get = baseApi.$get;
            return Fetcher.useHonoQuery($get, keys.events, {});
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
    },
};
