import { useToggleFullScreen } from "../hooks/use-toggle-fullscreen";
import {
    formatDuration,
    useUpdateCallDuration,
} from "../hooks/use-update-call-duration";
import {
    useCallStateHooks,
    useI18n,
    useParticipantViewContext,
} from "@stream-io/video-react-sdk";

import { VolumeControl } from "./volumn-control";

interface ParticipantOverlayProps {
    enableFullScreen?: boolean;
    showParticipantCount?: boolean;
    showDuration?: boolean;
    showLiveBadge?: boolean;
    showSpeakerName?: boolean;
}

export const ParticipantOverlay = ({
    enableFullScreen,
    showDuration,
    showLiveBadge,
    showParticipantCount,
    showSpeakerName,
}: ParticipantOverlayProps) => {
    const { participant } = useParticipantViewContext();
    const { useParticipantCount } = useCallStateHooks();
    const participantCount = useParticipantCount();
    const duration = useUpdateCallDuration();
    const toggleFullScreen = useToggleFullScreen();
    const { t } = useI18n();
    return (
        <div className="str-video__livestream-layout__overlay">
            <div className="str-video__livestream-layout__overlay__bar">
                {showLiveBadge && (
                    <span className="str-video__livestream-layout__live-badge">
                        {t("Live")}
                    </span>
                )}
                {showParticipantCount && (
                    <span className="str-video__livestream-layout__viewers-count">
                        {participantCount}
                    </span>
                )}
                {showSpeakerName && (
                    <span
                        className="str-video__livestream-layout__speaker-name"
                        title={participant.name || participant.userId || ""}
                    >
                        {participant.name || participant.userId || ""}
                    </span>
                )}
                {showDuration && (
                    <span className="str-video__livestream-layout__duration">
                        {formatDuration(duration)}
                    </span>
                )}
                {enableFullScreen && (
                    <span
                        className="str-video__livestream-layout__go-fullscreen"
                        onClick={toggleFullScreen}
                    />
                )}
                {/* <VolumeControl /> */}
            </div>
        </div>
    );
};
