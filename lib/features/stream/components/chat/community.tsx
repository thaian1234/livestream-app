"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { CollapsibleSection } from "@/components/collapsible-section";
import { IconInput, LeftIcon } from "@/components/icon-input";

const broadcasterData = [{ id: "1", username: "user1" }];
const moderatorsData = [
    { id: "1", username: "user1" },
    { id: "2", username: "user2" },
    { id: "3", username: "user3" },
];
const communityVIPsData = [
    { id: "1", username: "user1" },
    { id: "2", username: "user2" },
    { id: "3", username: "user3" },
    { id: "4", username: "user4" },
    { id: "5", username: "user5" },
    { id: "6", username: "user6" },
    { id: "7", username: "user7" },
    { id: "8", username: "user8" },
    { id: "9", username: "user9" },
    { id: "10", username: "user10" },
];
export function Community() {
    const [isOpenBroadcaster, setIsOpenBroadcaster] = useState(true);
    const [isOpenModerators, setIsOpenModerators] = useState(true);
    const [isOpenCommunityVIPs, setIsOpenCommunityVIPs] = useState(true);

    return (
        <>
            <div className="mx-1 my-2">
                <IconInput
                    placeholder="Filter"
                    variant="primary"
                    customSize="sm"
                    className="border-gray-500 bg-transparent pl-12"
                >
                    <LeftIcon>
                        <Search className="size-5 text-gray-500" />
                    </LeftIcon>
                </IconInput>
            </div>

            <CollapsibleSection
                isOpen={isOpenBroadcaster}
                setIsOpen={setIsOpenBroadcaster}
                title={"Broadcaster"}
            >
                {broadcasterData.map((data) => (
                    <div key={data.id} className="flex items-center py-1">
                        <p>{data.username}</p>
                    </div>
                ))}
            </CollapsibleSection>
            <CollapsibleSection
                isOpen={isOpenModerators}
                setIsOpen={setIsOpenModerators}
                title={"Moderators"}
            >
                {moderatorsData.map((data) => (
                    <div key={data.id} className="flex items-center py-1">
                        <p>{data.username}</p>
                    </div>
                ))}
            </CollapsibleSection>
            <CollapsibleSection
                isOpen={isOpenCommunityVIPs}
                setIsOpen={setIsOpenCommunityVIPs}
                title={"Community VIPs"}
            >
                {communityVIPsData.map((data) => (
                    <div key={data.id} className="flex items-center py-1">
                        <p>{data.username}</p>
                    </div>
                ))}
            </CollapsibleSection>
        </>
    );
}
