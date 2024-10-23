import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import type { FormEvent } from "react";

import {
    IncomingVideoSetting,
    applyIncomingVideoSetting,
    incomingVideoResolutionToSetting,
    incomingVideoSettings,
} from "./video-setting";

const VideoQualitySelector = () => {
    const call = useCall();
    const { useIncomingVideoSettings } = useCallStateHooks();
    const { enabled, preferredResolution } = useIncomingVideoSettings();
    let currentSetting: IncomingVideoSetting;

    if (!preferredResolution) {
        currentSetting = enabled ? "auto" : "off";
    } else {
        currentSetting = incomingVideoResolutionToSetting(preferredResolution);
    }

    const handleChange = (event: FormEvent<HTMLSelectElement>) => {
        if (call) {
            const setting = event.currentTarget.value as IncomingVideoSetting;
            applyIncomingVideoSetting(call, setting);
        }
    };

    return (
        <span className="quality-selector">
            <select
                className="quality-selector-dropdown"
                value={currentSetting}
                onChange={handleChange}
            >
                {incomingVideoSettings.map((setting) => (
                    <option key={setting} value={setting}>
                        {setting}
                    </option>
                ))}
            </select>
        </span>
    );
};
