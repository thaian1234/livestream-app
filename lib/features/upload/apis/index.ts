import { uploadToR2Bucket } from "../utils/upload-r2";

import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    session: ["session"],
};

export const uploadApi = {
    query: {},
    mutation: {
        useUploadAvatar(file: File | null) {
            const $post = client.api.upload.avatar.$post;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $post,
                {
                    onSuccess({ data }) {
                        if (!file) {
                            throw new Error(
                                "Please select one file for uploading!",
                            );
                        }
                        toast.promise(uploadToR2Bucket(data.signedUrl, file), {
                            loading: "Uploading...",
                            success: () => {
                                queryClient.invalidateQueries({
                                    queryKey: keys.session,
                                });
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
