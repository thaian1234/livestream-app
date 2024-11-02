
export interface CommunityData {
    createdAt: string;
    id: string;
    username: string;
    imageUrl: string | null;
    email: string;
    emailVerified: boolean;
}

export function formatCommunityData(data: CommunityData) {
    const formattedDate = new Date(data.createdAt).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        },
    );

    return {
        id: data.id,
        username: data.username,
        imageUrl: data.imageUrl,
        createdAt: formattedDate,
    };
}