import {
    UseMutationOptions,
    UseQueryOptions,
    UseSuspenseQueryOptions,
    useMutation,
    useQuery,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { SuccessStatusCode } from "hono/utils/http-status";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "../providers/auth-provider";

export namespace Fetcher {
    type ClientType = (...args: any[]) => any;
    type ResponseType<T extends ClientType> = InferResponseType<
        T,
        SuccessStatusCode
    >;
    type RequestType<T extends ClientType> = InferRequestType<T>;

    const handleResponse = async (res: Response) => {
        if (!res.ok) {
            throw new Error((await res.json()).msg);
        }
        return await res.json();
    };

    export function useHonoQuery<T extends ClientType>(
        client: T,
        queryKey: string[],
        request?: RequestType<T>,
        options?: Omit<
            UseQueryOptions<RequestType<T>, Error, ResponseType<T>>,
            "queryKey" | "queryFn"
        >,
    ) {
        return useQuery<RequestType<T>, Error, ResponseType<T>>({
            ...options,
            queryKey,
            queryFn: async () => handleResponse(await client(request)),
        });
    }

    export function useHonoSuspenseQuery<T extends ClientType>(
        client: T,
        queryKey: string[],
        request?: RequestType<T>,
        options?: Omit<
            UseSuspenseQueryOptions<RequestType<T>, Error, ResponseType<T>>,
            "queryKey" | "queryFn"
        >,
    ) {
        return useSuspenseQuery<RequestType<T>, Error, ResponseType<T>>({
            ...options,
            queryKey,
            queryFn: async () => handleResponse(await client(request)),
        });
    }

    export function useHonoMutation<T extends ClientType>(
        client: T,
        options?: Omit<
            UseMutationOptions<ResponseType<T>, Error, RequestType<T>>,
            "mutationFn"
        >,
    ) {
        const queryClient = useQueryClient();
        const router = useRouter();
        const { user } = useAuth();

        const mutation = useMutation<ResponseType<T>, Error, RequestType<T>>({
            mutationFn: async (data) => handleResponse(await client(data)),
            ...options,
        });

        return {
            mutation,
            queryClient,
            router,
            toast,
            user,
        };
    }
}
