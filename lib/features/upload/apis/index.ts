import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { UploadRouteType } from "@/server/api/routes/upload.routes";

import { uploadToR2Bucket } from "../utils/upload-r2";

const baseApi = baseClient<UploadRouteType>().upload;

const keys = {
    session: ["session"],
};

export const uploadApi = {
    query: {},
    mutation: {
        useUpload(file: File | null) {
            const $post = baseApi[":type"].$post;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $post,
                {
                    onSuccess({ data }, { param, query }) {
                        if (!file) {
                            throw new Error(
                                "Please select one file for uploading!",
                            );
                        }
                        toast.promise(uploadToR2Bucket(data.signedUrl, file), {
                            loading: "Uploading...",
                            success: () => {
                                if (param.type === "stream-thumbnail") {
                                    queryClient.invalidateQueries({
                                        queryKey: ["stream_information"],
                                    });
                                }
                                if (param.type === "video-thumbnail") {
                                    queryClient.invalidateQueries({
                                        queryKey: ["videos", query.videoId],
                                    });
                                }
                                return "Image uploaded successfully";
                            },
                            error: "Failed to upload image",
                        });
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
