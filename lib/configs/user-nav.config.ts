import { LucideIcon, UserIcon, Users2Icon, VideoIcon } from "lucide-react";

import { ROUTES } from "./routes.config";

type Menu = {
    href: string;
    label: string;
    icon: LucideIcon;
};

export function getUserNavConfig(username: string): Menu[] {
    return [
        {
            label: "Stream",
            href: ROUTES.DASHBOARD_STREAM_PAGE(username),
            icon: VideoIcon,
        },
        {
            label: "Community",
            href: ROUTES.COMMUNITY_PAGE(username),
            icon: Users2Icon,
        },
        {
            label: "Account",
            href: ROUTES.ACCOUNT_PAGE(username),
            icon: UserIcon,
        },
    ];
}
