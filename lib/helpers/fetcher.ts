import {
    UseMutationOptions,
    UseQueryOptions,
    useMutation,
    useQuery,
} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { HttpStatus } from "@/server/api/lib/constant/http.type";

export namespace Fetcher {
    type ClientType = (...args: any[]) => any;
    type ResponseType<T extends ClientType> = InferResponseType<
        T,
        HttpStatus.OK
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
        options?: Omit<
            UseQueryOptions<RequestType<T>, Error, ResponseType<T>>,
            "queryKey" | "queryFn"
        >,
    ) {
        return useQuery<RequestType<T>, Error, ResponseType<T>>({
            queryKey,
            queryFn: async (data) => handleResponse(await client(data)),
            ...options,
        });
    }

    export function useHonoMutation<T extends ClientType>(
        client: T,
        options?: Omit<
            UseMutationOptions<ResponseType<T>, Error, RequestType<T>>,
            "mutationFn"
        >,
    ) {
        return useMutation<ResponseType<T>, Error, RequestType<T>>({
            mutationFn: async (data) => handleResponse(await client(data)),
            ...options,
        });
    }
}
