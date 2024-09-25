import { useState } from "react";

import { CollapsibleSidebar } from "@/components/collapsible-sidebar";

import { Item } from "./item";

export function LivePreviewSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <CollapsibleSidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Recommended"
        >
            <Item />
        </CollapsibleSidebar>
    );
}
