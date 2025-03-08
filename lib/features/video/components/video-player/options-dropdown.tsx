import { Flag, Heart } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OptionsDropdownProps {
    children: React.ReactNode;
}
export function OptionsDropdown({ children }: OptionsDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
                <DropdownMenuItem>
                    <Heart size={18} />
                    <span>Save</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Flag size={18} />
                    <span>Report</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
