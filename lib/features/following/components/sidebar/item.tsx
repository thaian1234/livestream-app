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
export function Item() {
    return (
        <>
            {followingData.map((following, index) => (
                <button
                    key={index}
                    className="flex w-full items-center space-x-2 bg-transparent py-2 hover:bg-search"
                >
                    <Image
                        className="rounded-full"
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
