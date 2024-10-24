import { ParticipantOverlay } from "../components/controls/participant-overlay";
import { usePaginatedLayoutSortPreset } from "../hooks/use-paginated-layout";
import { useCall, useCallStateHooks } from "@stream-io/video-react-bindings";
import { ParticipantView, ParticipantsAudio } from "@stream-io/video-react-sdk";

import { cn } from "@/lib/utils";

/**
 * The props for the {@link MyLivestreamLayout} component.
 */
interface LivestreamLayoutProps {
    /**
     * Whether the livestream is muted. Defaults to `false`.
     */
    muted?: boolean;

    /**
     * Whether to show the participant count. Defaults to `true`.
     */
    showParticipantCount?: boolean;

    /**
     * Whether to enable fullscreen mode. Defaults to `true`.
     */
    enableFullScreen?: boolean;

    /**
     * Whether to show the duration of the call. Defaults to `true`.
     */
    showDuration?: boolean;

    /**
     * Whether to show the live badge. Defaults to `true`.
     */
    showLiveBadge?: boolean;

    /**
     * Whether to show the speaker name. Defaults to `false`.
     */
    showSpeakerName?: boolean;

    /**
     * When set to `false` disables mirroring of the local partipant's video.
     * @default true
     */
    mirrorLocalParticipantVideo?: boolean;

    /**
     * The props to pass to the floating participant element.
     */
    floatingParticipantProps?: LivestreamLayoutProps & {
        /**
         * The position of the floating participant element. Defaults to `top-right`.
         */
        position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    };
}

export function MyLivestreamLayout(props: LivestreamLayoutProps) {
    const { useParticipants, useRemoteParticipants, useHasOngoingScreenShare } =
        useCallStateHooks();
    const call = useCall();
    const participants = useParticipants();
    const [currentSpeaker] = participants;
    const remoteParticipants = useRemoteParticipants();
    const hasOngoingScreenShare = useHasOngoingScreenShare();

    usePaginatedLayoutSortPreset(call);

    const Overlay = (
        <ParticipantOverlay
            showParticipantCount={props.showParticipantCount}
            showDuration={props.showDuration}
            showLiveBadge={props.showLiveBadge}
            showSpeakerName={props.showSpeakerName}
            enableFullScreen={props.enableFullScreen}
        />
    );

    const { floatingParticipantProps } = props;
    const FloatingParticipantOverlay = hasOngoingScreenShare && (
        <ParticipantOverlay
            // these elements aren't needed for the video feed
            showParticipantCount={
                floatingParticipantProps?.showParticipantCount ?? false
            }
            showDuration={floatingParticipantProps?.showDuration ?? false}
            showLiveBadge={floatingParticipantProps?.showLiveBadge ?? false}
            showSpeakerName={floatingParticipantProps?.showSpeakerName ?? true}
            enableFullScreen={false}
        />
    );

    return (
        <div
            className={cn(
                "str-video__livestream-layout__wrapper",
                "m-0 aspect-video w-full p-0",
            )}
        >
            <ParticipantsAudio participants={remoteParticipants} />
            {currentSpeaker && (
                <ParticipantView
                    className={cn(
                        hasOngoingScreenShare &&
                            cn(
                                "str-video__livestream-layout__floating-participant",
                                `str-video__livestream-layout__floating-participant--${
                                    floatingParticipantProps?.position ??
                                    "top-right"
                                }`,
                            ),
                    )}
                    participant={currentSpeaker}
                    ParticipantViewUI={FloatingParticipantOverlay || Overlay}
                    mirror={
                        props.mirrorLocalParticipantVideo !== false
                            ? undefined
                            : false
                    }
                    muteAudio // audio is rendered by ParticipantsAudio
                />
            )}
        </div>
    );
}
