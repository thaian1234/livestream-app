import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";
import { PaginationType } from "@/lib/types";

import { VideoRouteType } from "@/server/api/routes/video.routes";

const baseApi = baseClient<VideoRouteType>().videos;
const baseKey = ["videos"];

const keys = {
    videos: baseKey,
    video: (id: string) => [...baseKey, id],
    recordings: [...baseKey, "recordings"],
    video_categories: (videoId?: string) =>
        ["video_categories", videoId] as string[],
    ownedVideos: (pagination: PaginationType) =>
        [...baseKey, pagination] as string[],
    videosRelate: (videoId: string) => ["video_relate", videoId] as string[],
    videosByUsername: (pagination: PaginationType, username: string) =>
        [...baseKey, username, pagination] as string[],
    videosProfile: (username: string) => [...baseKey, "profile"] as string[],
};

export const videoApi = {
    query: {
        useGetVideos() {
            const $get = baseApi.$get;
            return Fetcher.useHonoQuery($get, keys.videos, {});
        },
        useGetVideo(id: string) {
            const $get = baseApi[":id"].$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.video(id),
                {
                    param: {
                        id,
                    },
                },
                {
                    enabled: !!id,
                },
            );
        },
        useGetOwnedVideos(pagination: PaginationType) {
            const $get = baseApi.me.$get;
            return Fetcher.useHonoQuery($get, keys.ownedVideos(pagination), {
                query: {
                    page: pagination.page,
                    size: pagination.size,
                },
            });
        },
        useGetVideoCategories(videoId?: string) {
            const $get = baseApi.categories.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.video_categories(videoId),
                {
                    query: {
                        id: videoId,
                    },
                },
                {
                    enabled: !!videoId,
                },
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
        useGetVideosByUsername(pagination: PaginationType, username: string) {
            const $get = baseApi.username[":username"].$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.videosByUsername(pagination, username),
                {
                    query: {
                        page: pagination.page,
                        size: pagination.size,
                    },
                    param: {
                        username,
                    },
                },
            );
        },
        useGetVideoProfilesByUsername(username: string) {
            const $get = baseApi["profile-video"][":username"].$get;
            return Fetcher.useHonoQuery($get, keys.videosProfile(username), {
                param: {
                    username,
                },
            });
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
            const { mutation, toast, router, user, queryClient } =
                Fetcher.useHonoMutation($delete, {
                    onSuccess({ msg }) {
                        if (user) {
                            router.replace(ROUTES.STUDIO_PAGE(user.username));
                            queryClient.invalidateQueries({
                                queryKey: keys.videos,
                            });
                            toast.success("Video deleted");
                        }
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                });
            return mutation;
        },
        useAddCategoriesToVideo() {
            const $post = baseApi["add-categories"].$post;
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
        useGenerateThumbnail() {
            const $post = baseApi["generate-thumbnail"].$post;
            const { mutation, queryClient, toast } = Fetcher.useHonoMutation(
                $post,
                {
                    onError(err) {
                        console.error(err);
                        toast.error("Please try different word again");
                    },
                    onSuccess({}, { json }) {
                        queryClient.invalidateQueries({
                            queryKey: keys.video(json.videoId),
                        });
                        toast.success(
                            "Successfully generate thumbnail for video",
                        );
                    },
                },
            );
            return mutation;
        },
    },
};
