import {
    useCallStateHooks,
    useParticipantViewContext,
} from "@stream-io/video-react-sdk";
import { Mic, MicOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export const VolumeControl = () => {
    const { videoElement } = useParticipantViewContext();
    const { useMicrophoneState } = useCallStateHooks();
    const { isMute } = useMicrophoneState();
    const [volume, setVolume] = useState(50);

    const isMuted = isMute && volume === 0;

    const updateVideoVolume = useCallback(
        (newVolume: number) => {
            if (videoElement) {
                videoElement.volume = newVolume / 100;
                videoElement.muted = newVolume === 0;
            }
        },
        [videoElement],
    );

    const handleToggleMute = useCallback(() => {
        const newVolume = isMuted ? 50 : 0;
        setVolume(newVolume);
        updateVideoVolume(newVolume);
    }, [isMuted, updateVideoVolume]);

    const handleVolumeChange = useCallback(
        (value: number[]) => {
            const newVolume = value[0];
            setVolume(newVolume);
            updateVideoVolume(newVolume);
        },
        [updateVideoVolume],
    );

    useEffect(() => {
        updateVideoVolume(volume);
    }, [volume, updateVideoVolume]);

    return (
        <div className="flex items-center space-x-4">
            <Button onClick={handleToggleMute} disabled={!videoElement}>
                {isMuted ? <MicOff /> : <Mic />}
            </Button>
            <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-32"
                disabled={!videoElement}
            />
        </div>
    );
};
