import { Wallet } from "lucide-react";

import { WalletPopover } from "@/lib/features/donation/components/wallet-popover";
import { NotificationPopover } from "@/lib/features/notification/components/notification-popover";
import { useUser } from "@/lib/hooks/use-user";

import { Button } from "@/components/ui/button";

import { UserNav } from "../../../features/user/components/user-nav";
import { StreamUpdateDialog } from "../../stream-update-dialog";
import { SheetMenu } from "../sidebar/sheet-menu";

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
    const { user } = useUser();

    return (
        <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
            <div className="mx-4 flex h-16 items-center sm:mx-8">
                <div className="flex items-center space-x-4 lg:space-x-0">
                    <SheetMenu />
                </div>
                <div className="flex flex-1 items-center justify-end space-x-8 pr-4">
                    <NotificationPopover />
                    <StreamUpdateDialog username={user.username} />
                    <WalletPopover>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            aria-label="Wallets"
                        >
                            <Wallet
                                className="size-6"
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        </Button>
                    </WalletPopover>
                    <UserNav />
                </div>
            </div>
        </header>
    );
}
