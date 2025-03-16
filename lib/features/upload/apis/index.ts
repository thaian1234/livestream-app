import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { UploadRouteType } from "@/server/api/routes/upload.routes";

import { uploadToR2Bucket } from "../utils/upload-r2";

const baseApi = baseClient<UploadRouteType>().upload;

const keys = {
    session: ["session"],
    video: (id: string) => ["videos", id],
};

export const uploadApi = {
    query: {},
    mutation: {
        useUpload(file: File | null) {
            const $post = baseApi[":type"].$post;
            const { mutation, toast } = Fetcher.useHonoMutation($post, {
                onSuccess({ data }) {
                    if (!file) {
                        throw new Error(
                            "Please select one file for uploading!",
                        );
                    }
                    toast.promise(uploadToR2Bucket(data.signedUrl, file), {
                        loading: "Uploading...",
                        success: () => {
                            return "Image uploaded successfully";
                        },
                        error: "Failed to upload image",
                    });
                },
                onError(err) {
                    toast.error(err.message);
                },
            });
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
                    onSuccess({},{json}) {
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
