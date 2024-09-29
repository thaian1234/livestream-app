import {
    LayoutGridIcon,
    LucideIcon,
    Settings2Icon,
    UserIcon,
    VideoIcon,
} from "lucide-react";

import { ROUTES } from "./routes.config";

type Menu = {
    href: string;
    label: string;
    icon: LucideIcon;
};

export function getUserNavConfig(username: string): Menu[] {
    return [
        {
            label: "Dashboard",
            href: ROUTES.DASHBOARD_PAGE(username),
            icon: LayoutGridIcon,
        },
        {
            label: "Stream",
            href: ROUTES.STREAM_PAGE(username),
            icon: VideoIcon,
        },
        {
            label: "Account",
            href: ROUTES.ACCOUNT_PAGE(username),
            icon: UserIcon,
        },
        {
            label: "Settings",
            href: ROUTES.SETTINGS_PAGE(username),
            icon: Settings2Icon,
        },
    ];
}
