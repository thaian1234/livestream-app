import { useJoinCall } from "../hooks/use-join-call";
import {
    Call,
    StreamCall,
    useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";

interface CustomCallProps {
    streamId: string;
    children: React.ReactNode;
}

export function CustomCall({ streamId, children }: CustomCallProps) {
    const { call, isPending, isError } = useJoinCall(streamId);
    if (isPending) {
        return <Spinner />;
    }
    if (isError) {
        return <p>User is offline please try again</p>;
    }

    return <StreamCall call={call}>{children}</StreamCall>;
}
