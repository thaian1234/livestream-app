"use client";

import { Profile } from "@/lib/components/profile/profile";
import { BlockList } from "@/lib/features/block/components/block-list";
import { FollowersList } from "@/lib/features/follow/components/community/followers-list";
import { FollowingsList } from "@/lib/features/follow/components/community/followings-list";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CommunityPage() {
    return (
        <div className="mx-auto mr-14 mt-10 flex space-x-14">
            {/* profile */}
            <Profile />
            {/* main */}
            <div className="flex-grow">
                <Tabs defaultValue="Following" className="w-full pr-14">
                    <TabsList className="grid w-2/3 grid-cols-3">
                        <TabsTrigger value="Following">Following</TabsTrigger>
                        <TabsTrigger value="Followers">Followers</TabsTrigger>
                        <TabsTrigger value="Block">Block</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Following">
                        <FollowersList />
                    </TabsContent>
                    <TabsContent value="Followers">
                        <FollowingsList />
                    </TabsContent>
                    <TabsContent value="Block">
                        <BlockList />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
