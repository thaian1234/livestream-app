"use client";

import { settingApi } from "../apis";
import { ClipboardCopyIcon, Copy, Eye, EyeOff, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCopyToClipboard } from "@/lib/hooks/use-copy-clipboard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface KeyFormProps {}

export function KeyForm({}: KeyFormProps) {
    const [showUrl, setShowUrl] = useState(false);

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
    const onShowUrl = () => {
        setShowUrl(!showUrl);
    };
    return (
        <div className="container space-y-2 py-4">
            <div className="relative">
                <button
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform cursor-pointer text-white/50 hover:text-white"
                    onClick={onShowUrl}
                    type="button"
                >
                    {showUrl ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <Input
                    disabled
                    type={showUrl ? "text" : "password"}
                    className="px-10"
                    placeholder={setting.data.setting?.serverUrl || ""}
                />

                <button
                    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/50 hover:text-white"
                    onClick={handleCopyServerUrl}
                    type="button"
                >
                    <Copy size={20} />
                </button>
            </div>
            <div className="flex space-x-4">
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
