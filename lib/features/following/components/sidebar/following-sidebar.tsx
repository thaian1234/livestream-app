import { useState } from "react";

import { CollapsibleSidebar } from "@/components/collapsible-sidebar";

import { Item } from "./item";

export function FollowingSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <CollapsibleSidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Following"
        >
            <Item />
        </CollapsibleSidebar>
    );
}
