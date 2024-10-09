import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useUpdateCallDuration = () => {
    const { useIsCallLive, useCallSession } = useCallStateHooks();
    const isCallLive = useIsCallLive();
    const session = useCallSession();
    const [duration, setDuration] = useState(() => {
        if (!session || !session.live_started_at) return 0;
        const liveStartTime = new Date(session.live_started_at);
        const now = new Date();
        return Math.floor((now.getTime() - liveStartTime.getTime()) / 1000);
    });

    useEffect(() => {
        if (!isCallLive) return;
        const interval = setInterval(() => {
            setDuration((d) => d + 1);
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [isCallLive]);

    return duration;
};
export const formatDuration = (durationInMs: number) => {
    const days = Math.floor(durationInMs / 86400);
    const hours = Math.floor(durationInMs / 3600);
    const minutes = Math.floor((durationInMs % 3600) / 60);
    const seconds = durationInMs % 60;

    return `${days ? days + " " : ""}${hours ? hours + ":" : ""}${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
