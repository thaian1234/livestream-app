import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Mic, MicIcon, MicOff, MicOffIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export const AudioVolumeIndicator = () => {
    const { useMicrophoneState, useSpeakerState } = useCallStateHooks();
    const { microphone, isMute, isEnabled } = useMicrophoneState();
    const { speaker } = useSpeakerState();
    const [volume, setVolume] = useState(50);

    // useEffect(() => {
    //     const initialVolume = speaker.state.volume * 100;
    //     setVolume(initialVolume);
    // }, [speaker]);

    const handleToggle = async () => {
        if (isMute && volume === 0) {
            setVolume(speaker.state.volume * 100);
        } else {
            setVolume(0);
        }
        await microphone.toggle();
    };

    const handleVolumeChange = (value: number[]) => {
        setVolume(value[0]);
        speaker.setVolume(value[0] / 100);
    };

    return (
        <div className="flex items-center space-x-4">
            <Button onClick={handleToggle}>
                {isMute && volume === 0 ? <MicOff /> : <Mic />}
            </Button>
            <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-32"
            />
        </div>
    );
};
