export interface CommunityData {
    createdAt: string;
    id: string;
    username: string;
    imageUrl: string | null;
    email: string;
    emailVerified: boolean;
}

export function formatCommunityData(data: CommunityData) {
    const formattedDate = new Date(data.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return {
        id: data.id,
        username: data.username,
        imageUrl: data.imageUrl,
        createdAt: formattedDate,
    };
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date.toLocaleString("vi-VN", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Asia/Ho_Chi_Minh",
    });
};

export const timeAgo = (date?: Date) => {
    if (!date) return "";
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(days / 365);
    return `${years}y ago`;
};
