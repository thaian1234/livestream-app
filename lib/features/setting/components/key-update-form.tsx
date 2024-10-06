"use client";

import { settingApi } from "../apis";
import { ClipboardCopyIcon } from "lucide-react";
import { toast } from "sonner";

import { useCopyToClipboard } from "@/lib/hooks/use-copy-clipboard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface KeyFormProps {}

export function KeyForm({}: KeyFormProps) {
    const { data: setting } = settingApi.query.useGetSetting();
    const { mutate: handleUpdateSetting, isPending: isUpdating } =
        settingApi.mutation.useUpdateSetting();
    const [_, copy] = useCopyToClipboard();
    const onSubmit = () => {
        handleUpdateSetting({});
    };
    const handleCopyServerUrl = () => {
        copy(setting.data.setting?.serverUrl || "").then(() => {
            toast.success("Copied successfully");
        });
    };
    const handleCopyStreamKey = () => {
        copy(setting.data.setting?.streamKey || "").then(() => {
            toast.success("Copied successfully");
        });
    };
    return (
        <div className="container">
            <div className="flex space-x-4">
                <Input
                    disabled
                    placeholder={setting.data.setting?.serverUrl || ""}
                />
                <Button onClick={handleCopyServerUrl}>
                    <ClipboardCopyIcon />
                </Button>
            </div>
            <div className="flex space-y-4">
                <Textarea
                    disabled
                    placeholder={setting.data.setting?.streamKey || ""}
                    className="resize-none"
                />
                <Button onClick={handleCopyStreamKey}>
                    <ClipboardCopyIcon />
                </Button>
            </div>
            <Button onClick={onSubmit} disabled={isUpdating}>
                Generate
            </Button>
        </div>
    );
}
