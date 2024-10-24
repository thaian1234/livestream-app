"use client";

import { Profile } from "@/lib/components/profile/profile";
import { BlockTable } from "@/lib/features/block/components/block-table";
import { FollowersTable } from "@/lib/features/follow/components/follow-table/followers-table";
import { FollowingsTable } from "@/lib/features/follow/components/follow-table/followings-table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CommunityPage() {
    return (
        <div className="mx-auto mr-14 mt-10 flex space-x-14">
            {/* profile */}
            <Profile />
            {/* main */}
            <div className="flex-grow">
                <Tabs defaultValue="Following" className="w-full pr-14">
                    <TabsList className="grid w-2/3 grid-cols-3 border border-white/50">
                        <TabsTrigger value="Following">Following</TabsTrigger>
                        <TabsTrigger value="Followers">Followers</TabsTrigger>
                        <TabsTrigger value="Block">Block</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Following">
                        <FollowingsTable />
                    </TabsContent>
                    <TabsContent value="Followers">
                        <FollowersTable />
                    </TabsContent>
                    <TabsContent value="Block">
                        <BlockTable />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
