"use client";

import { streamApi } from "../../apis";
import { useChannelViewers } from "../../hooks/use-channel-viewers";
import { Search } from "lucide-react";
import { Search as SearchIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ROUTES } from "@/lib/configs/routes.config";
import { BlockButton } from "@/lib/features/block/components/block-button";
import { useUser } from "@/lib/hooks/use-user";

import { CollapsibleSection } from "@/components/collapsible-section";
import { IconInput, LeftIcon } from "@/components/icon-input";
import { Spinner } from "@/components/ui/spinner";

type ParamsType = {
    username: string;
};

type SectionData = {
    id: string;
    username: string;
    type: "broadcaster" | "viewer";
};

export function Community() {
    const [openSections, setOpenSections] = useState({
        broadcaster: true,
        viewers: true,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const params = useParams<ParamsType>();
    const user = useUser();

    const { channelViewers } = useChannelViewers();

    const {
        data: streamer,
        isPending,
        isError,
    } = streamApi.query.useGetStreamInformation(params.username);

    // Memoized sections data
    const sections = useMemo(() => {
        if (!streamer) return [];

        const broadcasterSection: SectionData = {
            id: streamer.data.user.id,
            username: streamer.data.user.username,
            type: "broadcaster",
        };

        const viewerSections: SectionData[] = channelViewers
            .filter(
                (viewer) =>
                    viewer.id !== streamer.data.user.id &&
                    viewer.online &&
                    viewer.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
            )
            .map((viewer) => ({
                id: viewer.id,
                username: viewer.name,
                type: "viewer",
            }));

        return [broadcasterSection, ...viewerSections];
    }, [streamer, channelViewers, searchQuery]);

    if (isPending) return <Spinner />;
    if (!streamer || isError || streamer?.data.isBlocked) {
        router.replace(ROUTES.HOME_PAGE);
        return null;
    }

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <div className="community-container">
            <SearchInput
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <CommunitySection
                title="Broadcaster"
                isOpen={openSections.broadcaster}
                onToggle={() => toggleSection("broadcaster")}
                data={sections.filter(
                    (section) => section.type === "broadcaster",
                )}
                canBlock={false}
            />

            <CommunitySection
                title="Viewers"
                isOpen={openSections.viewers}
                onToggle={() => toggleSection("viewers")}
                data={sections.filter((section) => section.type === "viewer")}
                canBlock={user.user.id === streamer.data.user.id}
            />
        </div>
    );
}

// Reusable Section Component
function CommunitySection({
    title,
    isOpen,
    onToggle,
    data,
    canBlock,
}: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    data: SectionData[];
    canBlock: boolean;
}) {
    return (
        <CollapsibleSection isOpen={isOpen} setIsOpen={onToggle} title={title}>
            {data.map((item) => {
                return (
                    <div
                        key={item.id}
                        className="flex items-center justify-between py-1"
                    >
                        <p>{item.username}</p>
                        {canBlock && (
                            <BlockButton
                                blockedId={item.id}
                                isBlock={false}
                                key={item.id}
                                showText={false}
                            />
                        )}
                    </div>
                );
            })}
        </CollapsibleSection>
    );
}

function SearchInput({
    searchQuery,
    onSearchChange,
}: {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}) {
    return (
        <div className="mx-1 my-2">
            <IconInput
                placeholder="Filter"
                variant="primary"
                customSize="sm"
                className="border-gray-500 bg-transparent pl-12"
                onChange={(e) => onSearchChange(e.target.value)}
            >
                <LeftIcon>
                    <SearchIcon className="size-5 text-gray-500" />
                </LeftIcon>
            </IconInput>
        </div>
    );
}
