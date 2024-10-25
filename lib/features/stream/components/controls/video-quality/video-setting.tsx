import type { Call } from "@stream-io/video-react-sdk";

export const incomingVideoSettings = [
    "auto",
    "1080p",
    "720p",
    "480p",
    "off",
] as const;
export type IncomingVideoSetting = (typeof incomingVideoSettings)[number];
type VideoDimension = { width: number; height: number };

export function applyIncomingVideoSetting(
    call: Call,
    setting: IncomingVideoSetting,
) {
    if (setting === "auto") {
        call.setIncomingVideoEnabled(true);
    } else if (setting === "off") {
        call.setIncomingVideoEnabled(false);
    } else {
        call.setPreferredIncomingVideoResolution(
            incomingVideoSettingToResolution(setting),
        );
    }
}

function incomingVideoSettingToResolution(
    setting: Exclude<IncomingVideoSetting, "auto" | "off">,
): VideoDimension {
    switch (setting) {
        case "1080p":
            return { width: 1920, height: 1080 };
        case "720p":
            return { width: 1280, height: 720 };
        case "480p":
            return { width: 640, height: 480 };
    }
}

export function incomingVideoResolutionToSetting(
    resolution: VideoDimension,
): IncomingVideoSetting {
    switch (true) {
        case resolution.height >= 1080:
            return "1080p";
        case resolution.height >= 720:
            return "720p";
        case resolution.height >= 480:
            return "480p";
        default:
            return "auto";
    }
}
