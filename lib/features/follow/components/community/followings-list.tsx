import { followApi } from "../../apis";

import { ListSkeleton } from "@/lib/components/community/list-skeleton";

import { FollowItem } from "./follow-item";

const dummyDataFollowings = [
    { id: "1", username: "Channel 1", imageUrl: "/user.svg" },
    { id: "2", username: "Channel 2", imageUrl: "/user.svg" },
    { id: "3", username: "Channel 3", imageUrl: "/user.svg" },
    { id: "4", username: "Channel 4", imageUrl: "/user.svg" },
    { id: "5", username: "Channel 5", imageUrl: "/user.svg" },
    { id: "6", username: "Channel 6", imageUrl: "/user.svg" },
    { id: "7", username: "Channel 7", imageUrl: "/user.svg" },
    { id: "8", username: "Channel 8", imageUrl: "/user.svg" },
    { id: "9", username: "Channel 9", imageUrl: "/user.svg" },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg" },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg" },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg" },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg" },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg" },
];
export function FollowingsList() {
    const { data, isPending, error } = followApi.query.useFollow();
    if (data === undefined || isPending) {
        return <ListSkeleton />;
    }
    if (error) {
        return <p>Some thing went wrong</p>;
    }
    const following = data?.data.followings;
    return (
        <div className="flex h-full flex-col py-4 text-card-foreground shadow-sm">
            {following && <FollowItem followings={following} />}
        </div>
    );
}
