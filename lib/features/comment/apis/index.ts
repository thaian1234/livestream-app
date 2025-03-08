import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";
import { PaginationType } from "@/lib/types";

const baseApi = client.api.comments;
const baseKey = ["comments"];

const keys = {
    comments: baseKey,
    comment: (id: string) => [...baseKey, id],
    recordings: [...baseKey, "recordings"],
    comment_categories: (commentId?: string) =>
        ["comment_categories", commentId] as string[],
    commentsByUserId: (userId: string, pagination: PaginationType) =>
        [...baseKey, "user", userId, pagination] as string[],
    commentsRelate: (commentId: string) =>
        ["comment_relate", commentId] as string[],
};

export const commentApi = {
    query: {
        useGetComments(videoId?: string) {
            const $get = baseApi.$get;
            return Fetcher.useHonoQuery($get, keys.comments, {
                query: {
                    videoId: videoId,
                },
            });
        },
        useGetComment(id: string) {
            const $get = baseApi[":id"].$get;
            return Fetcher.useHonoQuery($get, keys.comment(id), {
                param: {
                    id,
                },
            });
        }
    },
    mutation: {
        useCreateComment() {
            const $post = baseApi.$post;
            const { mutation, toast, router, user, queryClient } =
                Fetcher.useHonoMutation($post, {
                    onSuccess({ msg, data }) {
                        queryClient.invalidateQueries({
                            queryKey: keys.comments,
                        });
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                });
            return mutation;
        },
        useUpdateComment() {
            const $put = baseApi[":id"].$patch;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $put,
                {
                    onSuccess({ msg, data }) {
                        queryClient.invalidateQueries({
                            queryKey: keys.comment(data.id),
                        });
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                },
            );
            return mutation;
        },
        useDeleteComment() {
            const $delete = baseApi[":id"].$delete;
            const { mutation, toast, router, user } = Fetcher.useHonoMutation(
                $delete,
                {
                    onSuccess({ msg }) {
                        if (user) {
                            router.replace(ROUTES.STUDIO_PAGE(user.username));
                            toast.success("Comment deleted");
                        }
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
