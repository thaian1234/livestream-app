import { CustomCall } from "../../layouts/custom-call";

import { LivestreamPlayer } from "./livestream-player";

interface MyLiveScreenProps {
    streamId: string;
}

export function MyLiveScreen({ streamId }: MyLiveScreenProps) {
    return (
        <CustomCall streamId={streamId}>
            <LivestreamPlayer />
        </CustomCall>
    );
}
