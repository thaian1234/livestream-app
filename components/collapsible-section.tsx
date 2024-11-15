import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Props {
    isOpen: boolean; // Trạng thái hiển thị Sidebar
    setIsOpen(value: boolean): void;
    title: String; // Tiêu đ�� Sidebar
    children: React.ReactNode; // Chỉ nhận các component React
}
export function CollapsibleSection({
    isOpen,
    setIsOpen,
    title,
    children,
}: Props) {
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-auto border-t border-gray-700 font-sans"
        >
            <div className="flex w-full items-center justify-between space-x-4">
                <p className="py-2 text-lg font-medium">{title}</p>
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover w-9 hover:rounded-full hover:bg-search hover:text-white"
                    >
                        {isOpen ? <ChevronUp /> : <ChevronDown />}
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="w-full">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}
