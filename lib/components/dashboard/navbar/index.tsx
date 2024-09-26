import { UserNav } from "../../../features/user/components/user-nav";
import { SheetMenu } from "../sidebar/sheet-menu";

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
    return (
        <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
            <div className="mx-4 flex h-16 items-center sm:mx-8">
                <div className="flex items-center space-x-4 lg:space-x-0">
                    <SheetMenu />
                </div>
                <div className="flex flex-1 items-center justify-end">
                    <UserNav />
                </div>
            </div>
        </header>
    );
}
