import { useJoinCall } from "../hooks/use-join-call";
import { StreamCall } from "@stream-io/video-react-sdk";

import { HttpStatus } from "@/server/api/lib/constant/http.type";

import { Spinner } from "@/components/ui/spinner";

interface CustomCallProps {
    streamId: string;
    children: React.ReactNode;
}

export function CustomCall({ streamId, children }: CustomCallProps) {
    const { call, isPending, error } = useJoinCall(streamId);

    if (isPending) {
        return <Spinner />;
    }
    if (error) {
        if (error.status === HttpStatus.Forbidden) {
            return <p>User is offline please try agian</p>;
        }
        if (error.status === HttpStatus.NotFound) {
            return <p>Make sure you create a Stream Key before going live</p>;
        }
    }

    return <StreamCall call={call}>{children}</StreamCall>;
}
