import {
    Call,
    CallTypes,
    combineComparators,
    defaultSortPreset,
    dominantSpeaker,
    paginatedLayoutSortPreset,
    publishingAudio,
    publishingVideo,
    role,
    speaking,
} from "@stream-io/video-react-sdk";
import { useEffect } from "react";

const resetSortPreset = (call: Call) => {
    // reset the sorting to the default for the call type
    const callConfig = CallTypes.get(call.type);
    call.setSortParticipantsBy(
        callConfig.options.sortParticipantsBy || defaultSortPreset,
    );
};

export const usePaginatedLayoutSortPreset = (call: Call | undefined) => {
    useEffect(() => {
        if (!call) return;
        const livestreamComparator = combineComparators(
            role("host", "speaker"),
            dominantSpeaker,
            speaking,
            publishingVideo,
            publishingAudio,
        );
        call.setSortParticipantsBy(livestreamComparator);
        return () => {
            resetSortPreset(call);
        };
    }, [call]);
};
