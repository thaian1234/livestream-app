import { useJoinCall } from "../hooks/use-join-call";
import { StreamCall } from "@stream-io/video-react-sdk";
import { useEffect } from "react";

import { Spinner } from "@/components/ui/spinner";

interface CustomCallProps {
    streamId: string;
    children: React.ReactNode;
}

export function CustomCall({ streamId, children }: CustomCallProps) {
    const { data: call, isPending, isError } = useJoinCall(streamId);

    useEffect(() => {
        return () => {
            if (call) {
                call.leave().catch(() =>
                    console.error("Failed to leave the call"),
                );
            }
        };
    }, [call]);

    if (isPending) {
        return <Spinner />;
    }
    if (!call || isError) {
        return <p>Cannot join the call</p>;
    }

    return <StreamCall call={call}>{children}</StreamCall>;
}
