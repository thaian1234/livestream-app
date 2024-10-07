import {
    ParticipantView,
    StreamVideoParticipant,
} from "@stream-io/video-react-sdk";

import { Spinner } from "@/components/ui/spinner";

export function LocalParticipantVideo(props: {
    participant?: StreamVideoParticipant;
}) {
    const { participant } = props;
    return (
        <div className="relative h-32 w-32 xl:w-full">
            <ParticipantView
                participant={participant!}
                VideoPlaceholder={VideoPlaceholder}
            />
        </div>
    );
}

const VideoPlaceholder = () => {
    return (
        <div className="absolute inset-0 z-[1] flex items-center justify-center bg-slate-700 text-center text-slate-300">
            <Spinner />
        </div>
    );
};
