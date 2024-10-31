"use client";

import { settingApi } from "../apis";
import {
    ClipboardPasteIcon,
    KeySquareIcon,
    RadioTowerIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useCopyToClipboard } from "@/lib/hooks/use-copy-clipboard";

import { TooltipModel } from "@/components/tooltip-model";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SecretInput } from "@/components/ui/secret-input";

import { GenerateKeyAlert } from "./generate-key-alert";

interface KeyFormProps {
    hidingUpdateButton?: boolean;
}

export function KeyForm({ hidingUpdateButton = false }: KeyFormProps) {
    const { data: setting } = settingApi.query.useGetSetting();
    const { mutate: handleUpdateSetting, isPending: isUpdating } =
        settingApi.mutation.useUpdateSetting();

    const [_, copy] = useCopyToClipboard();
    const onSubmit = () => {
        handleUpdateSetting({});
    };

    const handleCopyServerUrl = () => {
        if (setting.data.setting?.serverUrl) {
            copy(setting.data.setting.serverUrl).then(() => {
                toast.success("Copied successfully");
            });
        }
    };
    const handleCopyStreamKey = () => {
        if (setting.data.setting?.streamKey) {
            copy(setting.data.setting?.streamKey).then(() => {
                toast.success("Copied successfully");
            });
        }
    };

    return (
        <Card className="rounded-md border border-slate-300">
            <CardHeader>
                <CardTitle className="text-xl">RMTP URL</CardTitle>
                <CardDescription>
                    Real-Time Messaging Protocol (RTMP) URL for streaming
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SecretInput
                    disabled
                    value={setting.data.setting?.serverUrl || ""}
                    leftIcon={<RadioTowerIcon size={20} />}
                    className="truncate"
                    rightIcon={
                        <TooltipModel content="Copy" side="bottom">
                            <button
                                className="text-white/50 hover:text-white"
                                onClick={handleCopyServerUrl}
                                type="button"
                            >
                                <ClipboardPasteIcon size={20} />
                            </button>
                        </TooltipModel>
                    }
                />
            </CardContent>
            <CardHeader className="mt-8">
                <CardTitle className="text-xl">STREAM KEY</CardTitle>
                <CardDescription>
                    Securely manage these sensitive keys. Do not share them with
                    anyone. If you suspect that one of your secret keys has been
                    compromised
                </CardDescription>
            </CardHeader>
            <CardContent className="mb-8">
                <SecretInput
                    disabled
                    value={setting.data.setting?.streamKey || ""}
                    leftIcon={<KeySquareIcon size={20} />}
                    className="truncate"
                    rightIcon={
                        <TooltipModel content="Copy" side="bottom">
                            <button
                                className="text-white/50 hover:text-white"
                                onClick={handleCopyStreamKey}
                                type="button"
                            >
                                <ClipboardPasteIcon size={20} />
                            </button>
                        </TooltipModel>
                    }
                />
            </CardContent>
            {!hidingUpdateButton && (
                <GenerateKeyAlert isPending={isUpdating} onSubmit={onSubmit} />
            )}
        </Card>
    );
}
