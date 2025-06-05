import { useCall } from "@stream-io/video-react-sdk";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { streamApi } from "../../apis";

interface ToggleLiveButtonProps {
    isLive: boolean;
    username: string;
}

export function ToggleLiveButton({ isLive, username }: ToggleLiveButtonProps) {
    const call = useCall();
    const { mutate: updateStream } =
        streamApi.mutation.useUpdateStream(username);

    if (!call) {
        return <Spinner />;
    }

    const handleToggleLive = async () => {
        try {
            if (isLive) {
                await call.stopLive();
            } else {
                await call.goLive();
            }

            updateStream({
                json: { isLive: !isLive },
            });
        } catch (error) {
            console.error("Failed to toggle live status:", error);
        }
    };

    return (
        <Button
            onClick={handleToggleLive}
            variant={isLive ? "default" : "gradient"}
            className="text-black-1"
        >
            {isLive ? "Stop Live" : "Go Live"}
        </Button>
    );
}
