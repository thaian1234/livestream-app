import { settingApi } from "../apis";

import { SettingDTO } from "@/server/api/dtos/setting.dto";

import { Switch } from "@/components/ui/switch";

type FieldTypes = "isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly";
interface ToggleCardProps {
    label: string;
    value: boolean;
    field: FieldTypes;
}

export function ToggleCard({ field, label, value }: ToggleCardProps) {
    const settingMutation = settingApi.mutation.useUpdateSetting();
    const onChange = () => {
        settingMutation.mutate({
            json: {
                [field]: !value,
            },
        });
    };
    return (
        <div className="rounded-xl bg-muted p-6">
            <div className="flex items-center justify-between">
                <p className="shrink-0 font-semibold">{label}</p>
                <div className="space-y-2">
                    <Switch
                        onCheckedChange={onChange}
                        disabled={settingMutation.isPending}
                        checked={value}
                    >
                        {value ? "On" : "Off"}
                    </Switch>
                </div>
            </div>
        </div>
    );
}
