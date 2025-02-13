import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    videos: ["videos"],
};

const baseApi = client.api.videos;
export const videoApi = {
    query: {
        useGetVideos() {
            const $get = baseApi.$get;
            return Fetcher.useHonoQuery($get, keys.videos, {});
        },
    },
    mutation: {
        useCreateVideo() {
            const $post = baseApi.$post;
            const { mutation, toast, router, user } = Fetcher.useHonoMutation(
                $post,
                {
                    onSuccess({ msg, data }) {
                        router.replace(
                            ROUTES.VIDEO_EDIT_PAGE(user.username, data.id),
                        );
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
