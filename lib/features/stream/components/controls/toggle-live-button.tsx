import { useCall } from "@stream-io/video-react-sdk";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ToggleLiveButtonProps {
    isLive: boolean;
}

export function ToggleLiveButton({ isLive }: ToggleLiveButtonProps) {
    const call = useCall();
    if (!call) {
        return <Spinner />;
    }
    const handleLive = async () => {
        await call.goLive();
    };
    const handleStopLive = async () => {
        await call.stopLive();
    };

    return (
        <Button onClick={() => (isLive ? handleStopLive() : handleLive())}>
            {isLive ? "Stop Live" : "Go Live"}
        </Button>
    );
}
