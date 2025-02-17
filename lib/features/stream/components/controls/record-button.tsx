import {
    CallRecordingReadyEvent,
    useCall,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export const RecordButton = () => {
    const call = useCall();
    const { useIsCallRecordingInProgress } = useCallStateHooks();
    const isCallRecordingInProgress = useIsCallRecordingInProgress();
    const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

    useEffect(() => {
        if (!call) return;
        // we wait until call.recording_started/stopped event
        // to remove the loading indicator
        const eventHandlers = [
            call.on("call.recording_started", () => {
                console.log("Started recording");
                setIsAwaitingResponse(false);
            }),
            call.on("call.recording_stopped", (data) => {
                console.log("Stopped recording: ", data);
                setIsAwaitingResponse(false);
            }),
            call.on("call.recording_ready", (data) => {
                console.log("Recording ready: ", data);
                setIsAwaitingResponse(false);
            }),
            call.on("call.recording_failed", () =>
                setIsAwaitingResponse(false),
            ),
        ];
        return () => {
            eventHandlers.forEach((unsubscribe) => unsubscribe());
        };
    }, [call]);

    const toggleRecording = useCallback(async () => {
        try {
            setIsAwaitingResponse(true);
            if (isCallRecordingInProgress) {
                await call?.stopRecording();
            } else {
                await call?.startRecording();
            }
        } catch (e) {
            console.error(`Failed start recording`, e);
        }
    }, [call, isCallRecordingInProgress]);

    return isAwaitingResponse ? (
        <Spinner />
    ) : (
        <Button onClick={toggleRecording}>Record</Button>
    );
};
