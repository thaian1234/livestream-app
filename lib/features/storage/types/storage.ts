export interface IStorage {
    storageId: string;
    userId: string;
    title: string;
    fileUrl: string;
    thumbnailUrl: string | null;
    status: "draft" | "processing" | "ready";
    recordedAt: string;
    duration: number;
    fileSize: number;
}

export const dummyStorageData: IStorage[] = [
    {
        storageId: "1",
        userId: "user1",
        title: "Recorded Video 1 cudbc uwdhwiuhd udgwiuhd ư ưg",
        fileUrl: "",
        thumbnailUrl: "",
        status: "ready",
        recordedAt: "2024-03-20T10:00:00Z",
        duration: 190,
        fileSize: 1024 * 1024 * 50, // 50MB
    },
    {
        storageId: "2",
        userId: "user1",
        title: "Recorded Video 2",
        fileUrl: "",
        thumbnailUrl: "",
        status: "processing",
        recordedAt: "2024-03-19T15:30:00Z",
        duration: 300,
        fileSize: 1024 * 1024 * 75, // 75MB
    },
    {
        storageId: "3",
        userId: "user1",
        title: "Recorded Video 3",
        fileUrl: "",
        thumbnailUrl: "",
        status: "draft",
        recordedAt: "2024-03-18T09:15:00Z",
        duration: 150,
        fileSize: 1024 * 1024 * 25, // 25MB
    },
];
