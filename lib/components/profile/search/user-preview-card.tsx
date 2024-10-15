import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserPreviewCardProps {
    id: string;
    username: string;
    followers: number;
    imageUrl: string;
    // Add more props if needed...
}
export function UserPreviewCard({
    id,
    username,
    followers,
    imageUrl,
}: UserPreviewCardProps) {
    const router = useRouter();
    const navigateUserProfile = () => {
        //navigate to user profile
    };
    return (
        <div className="flex h-full w-full flex-col items-center space-y-1 overflow-x-hidden">
            <button onClick={navigateUserProfile}>
                <Image
                    className="rounded-full object-cover"
                    src={imageUrl || "/user.svg"}
                    alt={username}
                    height={120}
                    width={120}
                />
            </button>
            <p className="text-xl">{username}</p>
            <p className="text-sm text-white/70">Followers: {followers}</p>
        </div>
    );
}
