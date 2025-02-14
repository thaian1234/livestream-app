import { ROUTES } from "@/lib/configs/routes.config";
import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    session: ["session"],
};

const baseApi = client.api.users;

export const userApi = {
    query: {},
    mutation: {
        useUpdateProfile() {
            const $patch = baseApi.$patch;
            const { mutation, toast, queryClient, router } =
                Fetcher.useHonoMutation($patch, {
                    onSuccess({ data }) {
                        toast.success("Profile updated");
                        queryClient.invalidateQueries({
                            queryKey: keys.session,
                        });
                        router.replace(ROUTES.PROFILE_PAGE(data.username));
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                });
            return mutation;
        },
        useChangePassword() {
            const $patch = baseApi["update-password"].$patch;
            const { mutation, toast } = Fetcher.useHonoMutation($patch, {
                onSuccess({ msg }) {
                    toast.success(msg);
                },
                onError(err) {
                    toast.error(err.message);
                },
            });
            return mutation;
        },
    },
};
