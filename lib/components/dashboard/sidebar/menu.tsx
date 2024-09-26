"use client";

import { Ellipsis, LogOut } from "lucide-react";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";

import { getDashboardMenuList } from "@/lib/configs/dashboard-menu.config";
import { ROUTES } from "@/lib/configs/routes.config";
import { useUser } from "@/lib/hooks/use-user";
import { useAuth } from "@/lib/providers/auth-provider";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { CollapseMenuButton } from "./collapse-menu-button";

interface MenuProps {
    isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
    const { user, error } = useUser();
    const pathname = usePathname();
    if (error) {
        notFound();
    }
    const menuList = getDashboardMenuList(pathname, user.username);

    return (
        <nav className="mt-8 h-dvh w-full">
            <ul className="flex w-full flex-col items-start space-y-1 px-2">
                {menuList.map(({ groupLabel, menus }, index) => (
                    <li
                        className={cn("w-full", groupLabel ? "pt-5" : "")}
                        key={index}
                    >
                        {(isOpen && groupLabel) || isOpen === undefined ? (
                            <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
                                {groupLabel}
                            </p>
                        ) : !isOpen && isOpen !== undefined && groupLabel ? (
                            <TooltipProvider>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger className="w-full">
                                        <div className="flex w-full items-center justify-center">
                                            <Ellipsis className="h-5 w-5" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>{groupLabel}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <p className="pb-2"></p>
                        )}
                        {menus.map(
                            (
                                { href, label, icon: Icon, active, submenus },
                                index,
                            ) =>
                                submenus.length === 0 ? (
                                    <div className="w-full" key={index}>
                                        <TooltipProvider
                                            disableHoverableContent
                                        >
                                            <Tooltip delayDuration={100}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={
                                                            active
                                                                ? "secondary"
                                                                : "ghost"
                                                        }
                                                        className="mb-1 h-10 w-full justify-start"
                                                        asChild
                                                    >
                                                        <Link href={href}>
                                                            <span
                                                                className={cn(
                                                                    isOpen &&
                                                                        "mr-4",
                                                                )}
                                                            >
                                                                <Icon
                                                                    size={18}
                                                                />
                                                            </span>
                                                            <p
                                                                className={cn(
                                                                    "max-w-[200px] truncate",
                                                                    isOpen ===
                                                                        false
                                                                        ? "-translate-x-96 opacity-0"
                                                                        : "translate-x-0 opacity-100",
                                                                )}
                                                            >
                                                                {label}
                                                            </p>
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                {isOpen === false && (
                                                    <TooltipContent side="right">
                                                        {label}
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                ) : (
                                    <div className="w-full" key={index}>
                                        <CollapseMenuButton
                                            icon={Icon}
                                            label={label}
                                            active={active}
                                            submenus={submenus}
                                            isOpen={isOpen}
                                        />
                                    </div>
                                ),
                        )}
                    </li>
                ))}
                <li className="flex w-full grow items-end">
                    <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Link href={ROUTES.HOME_PAGE}>
                                    <Button
                                        variant="outline"
                                        className="mt-5 h-10 w-full justify-center"
                                    >
                                        <span
                                            className={cn(
                                                isOpen === false ? "" : "mr-4",
                                            )}
                                        >
                                            <LogOut size={18} />
                                        </span>
                                        <p
                                            className={cn(
                                                "whitespace-nowrap",
                                                isOpen === false
                                                    ? "hidden opacity-0"
                                                    : "opacity-100",
                                            )}
                                        >
                                            Back to home
                                        </p>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            {isOpen === false && (
                                <TooltipContent side="right">
                                    Back to home
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                </li>
            </ul>
        </nav>
    );
}
