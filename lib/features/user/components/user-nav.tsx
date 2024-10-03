"use client";

import { LayoutGrid, LogOut, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { getUserNavConfig } from "@/lib/configs/user-nav.config";
import { SignOutButton } from "@/lib/features/auth/components/signout-button";
import { useAuth } from "@/lib/providers/auth-provider";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/user-avatar";

export function UserNav() {
    const { user, isPending, error } = useAuth();
    if (error) {
        notFound();
    }
    if (isPending || !user) {
        return <Spinner />;
    }

    return (
        <DropdownMenu>
            <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="relative size-10 rounded-full"
                            >
                                <UserAvatar imageUrl={user.imageUrl} />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Profile</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium leading-none">
                            {user.username}
                        </p>
                        <p className="truncate text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/30" />
                <DropdownMenuGroup>
                    {getUserNavConfig(user.username).map(
                        ({ href, icon: Icon, label }) => (
                            <DropdownMenuItem
                                key={user.id}
                                className="hover:cursor-pointer"
                                asChild
                            >
                                <Link
                                    href={href}
                                    className="flex items-center py-3"
                                >
                                    <Icon className="mr-3 h-4 w-4" />
                                    {label}
                                </Link>
                            </DropdownMenuItem>
                        ),
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/30" />
                <SignOutButton>
                    <DropdownMenuItem className="hover:cursor-pointer">
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                    </DropdownMenuItem>
                </SignOutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
