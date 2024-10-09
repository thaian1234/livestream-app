import { useParticipantViewContext } from "@stream-io/video-react-sdk";
import { useEffect, useRef } from "react";

export function MyVideoRef() {
    const { videoElement } = useParticipantViewContext();
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (ref.current && videoElement) {
            ref.current.srcObject = videoElement.srcObject;
        }
    }, [videoElement]);

    return <video ref={ref} muted autoPlay playsInline />;
}
