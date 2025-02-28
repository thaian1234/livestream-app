import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";
import { PaginationType } from "@/lib/types";

const baseApi = client.api.videos;
const baseKey = ["videos"];

const keys = {
    videos: baseKey,
    video: (id: string) => [...baseKey, id],
    recordings: [...baseKey, "recordings"],
    video_categories: (videoId?: string) =>
        ["video_categories", videoId] as string[],
    videosByUserId: (userId: string, pagination: PaginationType) =>
        [...baseKey, "user", userId, pagination] as string[],
    videosRelate: (videoId: string) => ["video_relate", videoId] as string[],
};

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
        useGetVideoByUserId(userId: string, pagination: PaginationType) {
            const $get = baseApi.user[":userId"].$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.videosByUserId(userId, pagination),
                {
                    param: {
                        userId,
                    },
                    query: {
                        page: pagination.page,
                        size: pagination.size,
                    },
                },
            );
        },
        useGetRecordings() {
            const $get = baseApi.recordings.$get;
            return Fetcher.useHonoQuery($get, keys.recordings, {});
        },
        useGetVideoCategories(videoId?: string) {
            const $get = client.api.videos.categories.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.video_categories(videoId),
                {
                    query: {
                        id: videoId,
                    },
                },
                {},
            );
        },
        useGetRelateVideo(videoId: string) {
            const $get = baseApi[":id"].relate.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.video_categories(videoId),
                {
                    param: {
                        id: videoId,
                    },
                },
                {},
            );
        },
    },
    mutation: {
        useCreateVideo() {
            const $post = baseApi.$post;
            const { mutation, toast, router, user, queryClient } =
                Fetcher.useHonoMutation($post, {
                    onSuccess({ msg, data }) {
                        if (user) {
                            router.push(
                                ROUTES.VIDEO_EDIT_PAGE(user.username, data.id),
                            );
                            queryClient.invalidateQueries({
                                queryKey: keys.videos,
                            });
                        }
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
                        if (user) {
                            router.replace(ROUTES.STUDIO_PAGE(user.username));
                            toast.success("Video deleted");
                        }
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                },
            );
            return mutation;
        },
        useAddCategoriesToVideo() {
            const $post = client.api.videos["add-categories"].$post;
            const { mutation, queryClient, toast } = Fetcher.useHonoMutation(
                $post,
                {
                    onError(err) {
                        console.error(err);
                    },
                    onSuccess({}, { json }) {
                        queryClient.invalidateQueries({
                            queryKey: keys.video_categories(json.videoId),
                        });
                        toast.success("Successfully added categories to video");
                    },
                },
            );
            return mutation;
        },
    },
};
