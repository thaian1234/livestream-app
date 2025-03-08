import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const baseApi = client.api.videolikes;
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
