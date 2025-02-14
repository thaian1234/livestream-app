import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    videos: ["videos"],
    video: (id: string) => [...keys.videos, id],
    recordings: ["recordings"],
};

const baseApi = client.api.videos;
export const videoApi = {
    query: {
        useGetVideos() {
            const $get = baseApi.$get;
            return Fetcher.useHonoQuery($get, keys.videos, {});
        },
        useGetVideo(id: string) {
            const $get = baseApi[":id"].$get;
            return Fetcher.useHonoQuery($get, keys.video(id), {
                param: {
                    id,
                },
            });
        },
        useGetRecordings() {
            const $get = baseApi.recordings.$get;
            return Fetcher.useHonoQuery($get, keys.recordings, {});
        },
    },
    mutation: {
        useCreateVideo() {
            const $post = baseApi.$post;
            const { mutation, toast, router, user, queryClient } =
                Fetcher.useHonoMutation($post, {
                    onSuccess({ msg, data }) {
                        router.replace(
                            ROUTES.VIDEO_EDIT_PAGE(user.username, data.id),
                        );
                        queryClient.invalidateQueries({
                            queryKey: keys.videos,
                        });
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                });
            return mutation;
        },
        useUpdateVideo() {
            const $put = baseApi[":id"].$patch;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $put,
                {
                    onSuccess({ msg, data }) {
                        queryClient.invalidateQueries({
                            queryKey: keys.video(data.id),
                        });
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                },
            );
            return mutation;
        },
        useDeleteVideo() {
            const $delete = baseApi[":id"].$delete;
            const { mutation, toast, router, user } = Fetcher.useHonoMutation(
                $delete,
                {
                    onSuccess({ msg }) {
                        router.replace(ROUTES.STUDIO_PAGE(user.username));
                        toast.success("Video deleted");
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                },
            );
            return mutation;
        },
    },
};
