import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
    imageUrl: string | null;
}

export function UserAvatar({ imageUrl }: UserAvatarProps) {
    const userImage = imageUrl !== null ? imageUrl : undefined;
    return (
        <div className="flex items-center justify-center space-x-4">
            <Avatar className="border-2 border-white">
                <AvatarImage src={userImage} sizes="40" />
                <AvatarFallback />
            </Avatar>
        </div>
    );
}
