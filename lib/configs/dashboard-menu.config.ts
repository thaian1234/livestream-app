import {
    KeyIcon,
    LucideIcon,
    UserCog2Icon,
    UserRoundPenIcon,
    Users,
    Video,
    WalletMinimal,
} from "lucide-react";
import { BsDatabaseFillDown } from "react-icons/bs";
import { IconType } from "react-icons/lib";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { SiYoutubestudio } from "react-icons/si";

import { ROUTES } from "./routes.config";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon | IconType;
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getDashboardMenuList(
    pathname: string,
    username: string,
): Group[] {
    return [
        {
            groupLabel: "Streams",
            menus: [
                {
                    href: ROUTES.DASHBOARD_STREAM_PAGE(username),
                    label: "Stream",
                    active: pathname === ROUTES.DASHBOARD_STREAM_PAGE(username),
                    icon: Video,
                    submenus: [],
                },
                {
                    href: ROUTES.KEY_PAGE(username),
                    label: "Key",
                    active: pathname === ROUTES.KEY_PAGE(username),
                    icon: KeyIcon,
                    submenus: [],
                },
                {
                    href: ROUTES.COMMUNITY_PAGE(username),
                    label: "Community",
                    active: pathname === ROUTES.COMMUNITY_PAGE(username),
                    icon: Users,
                    submenus: [],
                },
                {
                    href: ROUTES.DASHBOARD_SCHEDULE_PAGE(username),
                    label: "Schedule",
                    active: pathname === ROUTES.ABOUT_PAGE(username),
                    icon: RiCalendarScheduleFill,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Channels",
            menus: [
                {
                    href: ROUTES.DONATION_PAGE(username),
                    label: "Donation",
                    active: pathname === ROUTES.DONATION_PAGE(username),
                    icon: WalletMinimal,
                    submenus: [],
                },
                {
                    href: ROUTES.STUDIO_PAGE(username),
                    label: "Studio",
                    active: pathname === ROUTES.STUDIO_PAGE(username),
                    icon: SiYoutubestudio,
                    submenus: [],
                },
                {
                    href: ROUTES.STORAGE_PAGE(username),
                    label: "Storage",
                    active: pathname === ROUTES.STORAGE_PAGE(username),
                    icon: BsDatabaseFillDown,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Accounts",
            menus: [
                {
                    href: ROUTES.PROFILE_PAGE(username),
                    label: "Profile",
                    active: pathname === ROUTES.PROFILE_PAGE(username),
                    icon: UserRoundPenIcon,
                    submenus: [],
                },
                {
                    href: ROUTES.ACCOUNT_PAGE(username),
                    label: "Account",
                    active: pathname === ROUTES.ACCOUNT_PAGE(username),
                    icon: UserCog2Icon,
                    submenus: [],
                },
            ],
        },
    ];
}
