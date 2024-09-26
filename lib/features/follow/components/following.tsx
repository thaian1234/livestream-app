import Image from "next/image";

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
];
export function Following() {
    const handleNavigate = (userId: String) => {
        console.log("Navigate to user profile");
    };
    return (
        <>
            {followingData.map((following, index) => (
                <button
                    onClick={() => handleNavigate(following.id)}
                    key={index}
                    className="flex w-full items-center space-x-4 rounded-sm bg-transparent py-2 pr-4 hover:bg-search"
                >
                    <Image
                        className="object-full flex-shrink-0"
                        src={following.avatar}
                        alt={following.userName}
                        height={40}
                        width={40}
                    />
                    <div className="w-auto truncate text-base">
                        {following.userName}
                    </div>
                </button>
            ))}
        </>
    );
}
