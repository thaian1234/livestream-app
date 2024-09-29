"use client";

import { Bell, Heart } from "lucide-react";
import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SignInForm } from "@/lib/features/auth/components/signin-form";
import { SignUpForm } from "@/lib/features/auth/components/signup-form";
import { AuthDialog } from "@/lib/features/auth/layouts/auth-dialog.layout";
import { useAuth } from "@/lib/providers/auth-provider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export const AfterSignin = () => {
    const { user } = useAuth();
    if (!user) {
        notFound();
    }
    return (
        <>
            <button>
                <Bell size={28} color="#ffffff" strokeWidth={2.5} />
            </button>
            <Link href={`/dashboard/${user.username}`}>
                <Heart size={28} color="#ffffff" strokeWidth={2.5} />
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="ml-8">
                        <Avatar>
                            <AvatarImage src="/user.svg" alt="user" />
                            <AvatarFallback>user</AvatarFallback>
                        </Avatar>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-0 bg-zinc-900 text-white">
                    <DropdownMenuLabel>User name</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/30" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-white/30" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Team</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>New Team</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-white/30" />
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export const BeforeSignin = () => {
    return (
        <section className="flex space-x-2">
            <AuthDialog
                isSignIn={true}
                title="Sign In"
                subTitle="Glad you're back!"
            >
                <SignInForm />
            </AuthDialog>
            <AuthDialog
                isSignIn={false}
                title="Sign Up"
                subTitle="Just some details to get you in !"
            >
                <SignUpForm />
            </AuthDialog>
        </section>
    );
};
export const IsPending = () => {
    return (
        <div className="flex items-center justify-around space-x-8">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
    );
};

export function Actions() {
    const { isSignedIn, isPending } = useAuth();
    if (isPending) return <IsPending />;
    return isSignedIn ? <AfterSignin /> : <BeforeSignin />;
}
