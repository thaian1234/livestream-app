import {
    Bookmark,
    LayoutGrid,
    LucideIcon,
    Tag,
    UserRoundCog,
    Users,
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
                    href: "/stream",
                    label: "Stream",
                    active: pathname.includes("/stream"),
                    icon: Video,
                    submenus: [
                        {
                            href: "/posts",
                            label: "All Posts",
                            active: pathname === "/posts",
                        },
                        {
                            href: "/posts/new",
                            label: "New Post",
                            active: pathname === "/posts/new",
                        },
                    ],
                },
                {
                    href: "/categories",
                    label: "Categories",
                    active: pathname.includes("/categories"),
                    icon: Bookmark,
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
            groupLabel: "Settings",
            menus: [
                {
                    href: "/users",
                    label: "Users",
                    active: pathname.includes("/users"),
                    icon: Users,
                    submenus: [],
                },
                {
                    href: ROUTES.ACCOUNT_PAGE(username),
                    label: "Account",
                    active: pathname === ROUTES.ACCOUNT_PAGE(username),
                    icon: UserRoundCog,
                    submenus: [],
                },
            ],
        },
    ];
}
