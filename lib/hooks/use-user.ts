import { authApi } from "../features/auth/apis";

export function useUser() {
    const { data, isPending, error, isError } =
        authApi.query.useSuspenseVerifySession();
    return {
        user: data.data.user,
        isPending,
        error,
        isError,
    };
}
