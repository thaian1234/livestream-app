import { TooltipModel } from "@/components/tooltip-model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const followingData = [
    {
        id: "1",
        userName: "John",
        avatar: "/user.svg",
    },
    {
        id: "1",
        userName: "John",
        avatar: "/user.svg",
    },
    {
        id: "1",
        userName: "Johnnnnnnnnnnnnnnnnnnnnnnnn",
        avatar: "/user.svg",
    },
    {
        id: "1",
        userName: "John",
        avatar: "/user.svg",
    },
    {
        id: "1",
        userName: "John",
        avatar: "/user.svg",
    },
    {
        id: "1",
        userName: "John",
        avatar: "/user.svg",
    },
];

export function CollapseSidebar() {
    const handleNavigate = (userId: String) => {
        console.log("Navigate to user profile");
    };
    return (
        <>
            {followingData.map((following, index) => (
                <TooltipModel
                    key={index}
                    content={following.userName}
                    side="right"
                >
                    <button onClick={() => handleNavigate(following.id)}>
                        <Avatar className="mx-auto mb-2 h-10 w-10">
                            <AvatarImage
                                src={following.avatar}
                                alt={following.userName}
                            />
                            <AvatarFallback>User</AvatarFallback>
                        </Avatar>
                    </button>
                </TooltipModel>
            ))}
        </>
    );
}
