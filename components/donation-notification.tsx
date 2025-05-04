import { Console } from "console";
import { HandCoinsIcon, WifiHighIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { formatDate } from "@/lib/helpers/formatData";

import { Button } from "@/components/ui/button";

interface DonationNotificationProps {
    donorName?: string;
    amount?: number;
}

export default function DonationNotification({
    donorName,
    amount,
}: DonationNotificationProps) {
    return (
        // To make the notification fixed, add classes like `fixed bottom-4 right-4` to the container element.
        <div className="shadow-black/5 z-[100] rounded-lg border border-border bg-white p-3 text-black-1 shadow-lg">
            <div className="flex items-center gap-2">
                <div
                    className="flex size-10 shrink-0 items-center justify-center"
                    aria-hidden="true"
                >
                    <HandCoinsIcon
                        className="text-green-500 opacity-60"
                        size={24}
                        strokeWidth={2}
                    />
                </div>
                <div className="flex items-center gap-8">
                    <div className="space-y-1">
                        <p className="truncate">
                            <span className="text-sm font-medium">
                                {donorName}
                            </span>{" "}
                            just donated to you!
                        </p>
                        <p className="text-xs font-medium">
                            {amount?.toLocaleString("vi-VN")} đ
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
