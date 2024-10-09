import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useQuery } from "@tanstack/react-query";

import { envClient } from "@/lib/env/env.client";
import { streamApi } from "@/lib/features/stream/apis";
import { useAuth } from "@/lib/providers/auth-provider";

export function useVideoClient() {
    const { user } = useAuth();
    const { data: tokenData } = streamApi.query.useGetStreamToken();

    return useQuery<StreamVideoClient | null, Error>({
        queryKey: ["videoClient", user?.id],
        queryFn: () => {
            if (!user || !tokenData) {
                return null;
            }
            const videoClient = StreamVideoClient.getOrCreateInstance({
                apiKey: envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
                user: {
                    id: user.id,
                    name: user.username,
                },
                token: tokenData.data.token,
                options: {
                    enableWSFallback: true,
                    timeout: 10000,
                },
            });
            return videoClient;
        },
        enabled: !!user && !!tokenData,
        refetchOnMount: "always",
        staleTime: 0,
    });
}
