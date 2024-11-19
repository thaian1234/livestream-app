import { settingApi } from "../apis";

import { Spinner } from "@/components/ui/spinner";

import { ToggleCard } from "./toggle-card";

interface SettingUpdateFormProps {}

export function SettingUpdateForm({}: SettingUpdateFormProps) {
    const { data, isPending } = settingApi.query.useGetSetting();
    const setting = data?.data.setting;

    if (isPending) {
        return <Spinner />;
    }
    if (!setting) {
        return <p>No setting found</p>;
    }

    return (
        <div className="flex flex-col space-y-4">
            <ToggleCard
                field="isChatEnabled"
                label="Enable chat"
                value={setting.isChatEnabled}
            />
            <ToggleCard
                field="isChatDelayed"
                label="Delay chat"
                value={setting.isChatDelayed}
            />
            <ToggleCard
                field="isChatFollowersOnly"
                label="Must be follwing to chat"
                value={setting.isChatFollowersOnly}
            />
        </div>
    );
}
