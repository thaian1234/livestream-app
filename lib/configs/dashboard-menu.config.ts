import {
    Bookmark,
    KeyIcon,
    LucideIcon,
    Tag,
    UserCog2Icon,
    UserRoundPenIcon,
    Video,
} from "lucide-react";

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
    icon: LucideIcon;
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
                    href: ROUTES.STREAM_PAGE(username),
                    label: "Stream",
                    active: pathname === ROUTES.STREAM_PAGE(username),
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
                    href: "/tags",
                    label: "Tags",
                    active: pathname.includes("/tags"),
                    icon: Tag,
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
