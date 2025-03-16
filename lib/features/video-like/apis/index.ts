import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { VideoLikeRouteType } from "@/server/api/routes/video-like.routes";

const baseApi = baseClient<VideoLikeRouteType>().videolikes;
const videoBaseKey = ["videos"];

const keys = {
    videos: videoBaseKey,
    video: (id: string) => [...videoBaseKey, id],
};
export const videolikeApi = {
    mutation: {
        useToggleVideoLike() {
            const $post = baseApi.$post;
            const { mutation, toast, router, queryClient } =
                Fetcher.useHonoMutation($post, {
                    onSuccess({ msg, data }) {
                        if (msg) {
                            toast.success(msg);
                            queryClient.invalidateQueries({
                                queryKey: keys.video(data),
                            });
                        }
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                });
            return mutation;
        },
    },
};
