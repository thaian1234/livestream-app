import { OauthButton } from "../components/oauth-buttons";
import { LogInIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface AuthDialogProps {
    isSignIn: boolean;
    children: React.ReactNode;
    subTitle?: string;
    title: string;
}

export function AuthDialog({
    title,
    subTitle,
    isSignIn,
    children,
}: AuthDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="ml-8 rounded-full border border-white bg-transparent text-white">
                    {isSignIn ? "Sign In" : "Sign Up"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl">{title}</DialogTitle>
                    <DialogDescription>{subTitle}</DialogDescription>
                </DialogHeader>
                {children}
                <OauthButton />
            </DialogContent>
        </Dialog>
    );
}
