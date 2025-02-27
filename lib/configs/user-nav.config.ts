import { LucideIcon, UserIcon, Users2Icon, VideoIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { SiYoutubestudio } from "react-icons/si";

import { ROUTES } from "./routes.config";

type Menu = {
    href: string;
    label: string;
    icon: LucideIcon | IconType;
};

export function getUserNavConfig(username: string): Menu[] {
    return [
        {
            label: "Stream",
            href: ROUTES.DASHBOARD_STREAM_PAGE(username),
            icon: VideoIcon,
        },
        {
            label: "Studio",
            href: ROUTES.STUDIO_PAGE(username),
            icon: SiYoutubestudio,
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
