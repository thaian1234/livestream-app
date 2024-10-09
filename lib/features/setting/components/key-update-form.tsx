"use client";

import { settingApi } from "../apis";
import { Copy, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useCopyToClipboard } from "@/lib/hooks/use-copy-clipboard";

import { TooltipModel } from "@/components/tooltip-model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface KeyFormProps {}

export function KeyForm({}: KeyFormProps) {
    const [showUrl, setShowUrl] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [data, setData] = useState({ key: "", url: "" });

    const { data: setting } = settingApi.query.useGetSetting();
    const { mutate: handleUpdateSetting, isPending: isUpdating } =
        settingApi.mutation.useUpdateSetting();
    useEffect(() => {
        if (setting.data) {
            setData((pre) => ({
                ...pre,
                url: setting.data.setting?.serverUrl || "url",
                key: setting.data.setting?.streamKey || "key",
            }));
        }
    }, []);

    const [_, copy] = useCopyToClipboard();
    const onSubmit = () => {
        handleUpdateSetting({});
    };

    const handleCopyServerUrl = () => {
        copy(data.url).then(() => {
            toast.success("Copied successfully");
        });
    };
    const handleCopyStreamKey = () => {
        copy(data.url).then(() => {
            toast.success("Copied successfully");
        });
    };

    const onShowUrl = () => {
        setShowUrl(!showUrl);
    };
    const onShowKey = () => {
        setShowKey(!showKey);
    };
    return (
        <div className="container space-y-2 py-4">
            <div className="relative">
                <button
                    className="absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 transform text-white/50 hover:text-white"
                    onClick={onShowUrl}
                    type="button"
                >
                    {showUrl ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <Input
                    disabled
                    type={showUrl ? "text" : "password"}
                    className="px-10 hover:text-white focus-visible:ring-white"
                    value={data.url}
                />
                <TooltipModel content="Copy" side="right">
                    <button
                        className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/50 hover:text-white"
                        onClick={handleCopyServerUrl}
                        type="button"
                    >
                        <Copy size={20} />
                    </button>
                </TooltipModel>
            </div>
            <div className="relative">
                <button
                    className="absolute left-3 top-5 z-10 h-5 w-5 -translate-y-1/2 transform text-white/50 hover:text-white"
                    onClick={onShowKey}
                    type="button"
                >
                    {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <Textarea
                    disabled
                    value={showKey ? data.key : data.key.replace(/./g, "•")}
                    className="resize-none px-10 text-base"
                />
                <TooltipModel content="Copy" side="right">
                    <button
                        className="absolute right-3 top-5 h-5 w-5 -translate-y-1/2 transform text-white/50 hover:text-white"
                        onClick={handleCopyStreamKey}
                        type="button"
                    >
                        <Copy size={20} />
                    </button>
                </TooltipModel>
            </div>
            <div className="flex justify-end">
                <Button
                    variant="gradient"
                    onClick={onSubmit}
                    disabled={isUpdating}
                    className="text-black-0"
                >
                    Generate
                </Button>
            </div>
        </div>
    );
}
