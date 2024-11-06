"use client";

import { ListSkeleton } from "@/lib/components/community/list-skeleton";
import { Profile } from "@/lib/components/profile/profile";
import { BlockTable } from "@/lib/features/block/components/block-table";
import { followApi } from "@/lib/features/follow/apis";
import { FollowersTable } from "@/lib/features/follow/components/follow-table/followers-table";
import { FollowingsTable } from "@/lib/features/follow/components/follow-table/followings-table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { M_PLUS_1 } from "next/font/google";

export default function CommunityPage() {
    const tabs = ["Following", "Followers", "Block"];
    const { data, isPending, error } = followApi.query.useFollow(
        '1', '1000'
    );
    if (data === undefined || isPending) {
        return <ListSkeleton />;
    }
    if (error) {
        return <p>Some thing went wrong</p>;
    }
    return (
        <div className="flex flex-col items-center space-y-10 p-4 lg:flex-row lg:items-start lg:space-x-10 lg:space-y-0">
            {/* profile */}
            <Profile
                followers={data.data.followers?.length || 0}
                followings={data.data.followings?.length || 0}
            />
            {/* main */}
            <div className="flex-grow">
                <Tabs defaultValue="Following" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        {tabs.map((tab, index) => (
                            <TabsTrigger
                                className="rounded-none border-b border-white/50 duration-0 data-[state=active]:rounded-none data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:border-white/50 data-[state=active]:bg-transparent data-[state=active]:text-white"
                                value={tab}
                                key={index}
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="Following">
                        <FollowingsTable rawFollowings={data.data.followings} />
                    </TabsContent>
                    <TabsContent value="Followers">
                        <FollowersTable rawFollowers={data.data.followers} />
                    </TabsContent>
                    <TabsContent value="Block">
                        <BlockTable />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
