import { addDays, addHours } from "date-fns";
import { z } from "zod";

import { randomDate } from "@/lib/helpers/formatData";

import { BlockDTO } from "@/server/api/dtos/block.dto";
import { CategoryDTO } from "@/server/api/dtos/category.dto";
import { FollowDTO } from "@/server/api/dtos/follow.dto";
import { StorageDTO } from "@/server/api/dtos/storage.dto";
import { StreamDTO } from "@/server/api/dtos/stream.dto";
import { UserDTO } from "@/server/api/dtos/user.dto";
import { VideoDTO } from "@/server/api/dtos/video.dto";
import { LuciaService } from "@/server/api/external-services/lucia.service";
import { Utils } from "@/server/api/lib/helpers/utils";

import Database from "..";
import tableSchemas from "../schemas";

const db = Database.getInstance().db;
const lucia = LuciaService.getInstance();

async function signUpAllUser(users: UserDTO.Select[]) {
    for (const user of users) {
        const password = "An@123456";
        const hashedPassword = await Utils.PasswordUtils.hashPassword(password);
        await db.update(tableSchemas.userTable).set({
            hashedPassword,
        });
        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
    }
}

const seeds = async () => {
    try {
        console.log("Seeding database");

        // Delete all tables
        await db.delete(tableSchemas.sessionTable);
        await db.delete(tableSchemas.emailVerificationTable);
        await db.delete(tableSchemas.followTable);
        await db.delete(tableSchemas.blockTable);
        await db.delete(tableSchemas.notificationTable);
        await db.delete(tableSchemas.streamTable);
        await db.delete(tableSchemas.settingTable);
        await db.delete(tableSchemas.accountTable);
        await db.delete(tableSchemas.userTable);
        await db.delete(tableSchemas.streamsToCategoriesTable);
        await db.delete(tableSchemas.categoryTable);

        // Seeding user
        let usersData: UserDTO.Insert[] = [];
        for (let i = 0; i <= 50; i++) {
            usersData.push({
                email: `user${i}@test.com`,
                username: `user_${i}`,
            });
        }
        const users = await db
            .insert(tableSchemas.userTable)
            .values(usersData)
            .returning();

        // Seeding session
        await signUpAllUser(users);

        // Seeding follow
        let followData: z.infer<typeof FollowDTO.insertSchema>[] = [];
        for (let i = 0; i <= 400; i++) {
            const randomIndex1 = Math.floor(Math.random() * users.length);
            const randomIndex2 = Math.floor(Math.random() * users.length);
            if (randomIndex1 !== randomIndex2) {
                followData.push({
                    followerId: users[randomIndex2].id,
                    followedId: users[randomIndex1].id,
                });
            }
        }
        await db
            .insert(tableSchemas.followTable)
            .values(followData)
            .onConflictDoNothing();

        // Seeding blocks
        let blockData: z.infer<typeof BlockDTO.insertSchema>[] = [];
        for (let i = 0; i < 75; i++) {
            const randomIndex1 = Math.floor(Math.random() * users.length);
            const randomIndex2 = Math.floor(Math.random() * users.length);
            if (randomIndex1 !== randomIndex2) {
                blockData.push({
                    blockerId: users[randomIndex1].id,
                    blockedId: users[randomIndex2].id,
                });
            }
        }
        await db
            .insert(tableSchemas.blockTable)
            .values(blockData)
            .onConflictDoNothing();

        // Seeding streams
        let streamData: z.infer<typeof StreamDTO.insertSchema>[] = [];
        for (const user of users) {
            streamData.push({
                userId: user.id,
                name: `${user.username}'s Stream`,
                isLive: Math.random() > 0.5,
            });
        }
        const streams = await db
            .insert(tableSchemas.streamTable)
            .values(streamData)
            .onConflictDoNothing()
            .returning();

        let categoryData: z.infer<typeof CategoryDTO.insertSchema>[] = [
            {
                name: "Strategy",
                slug: "startegy",
            },
            {
                name: "Horror",
                slug: "horror",
            },
            {
                name: "Fornite",
                slug: "fornite",
            },
            {
                name: "MOBA",
                slug: "moba",
            },
            {
                name: "FPS",
                slug: "fps",
            },
            {
                name: "Adventure Game",
                slug: "adventure_game",
            },
            {
                name: "Role Play",
                slug: "role_play",
            },
            {
                name: "Indie Game",
                slug: "indie_game",
            },
            {
                name: "Code Interview",
                slug: "code_interview",
            },
            {
                name: "Math",
                slug: "math",
            },
        ];
        let categories = await db
            .insert(tableSchemas.categoryTable)
            .values(categoryData)
            .onConflictDoNothing()
            .returning();

        let childCategory = await db
            .insert(tableSchemas.categoryTable)
            .values([
                {
                    name: "RPG",
                    slug: "rpg",
                    parentId: categories.find(
                        (category) => category.name === "Fornite",
                    )?.id,
                },
                {
                    name: "Jumpscare",
                    slug: "jumpscare",
                    parentId: categories.find(
                        (category) => category.name === "Horror",
                    )?.id,
                },
            ])
            .onConflictDoNothing()
            .returning();

        categories.push(...childCategory);

        let streamToCategories = [];
        for (const stream of streams) {
            const numberOfCategories = Math.floor(Math.random() * 4); // Random number between 0-3
            const shuffledCategories = [...categories].sort(
                () => Math.random() - 0.5,
            );
            const selectedCategories = shuffledCategories.slice(
                0,
                numberOfCategories,
            );
            const streamToCategory = selectedCategories.map((category) => ({
                streamId: stream.id,
                categoryId: category.id,
            }));
            streamToCategories.push(...streamToCategory);
        }
        if (streamToCategories.length !== 0) {
            await db
                .insert(tableSchemas.streamsToCategoriesTable)
                .values(streamToCategories)
                .onConflictDoNothing();
        }
        // Seeding storages
        const storagesToInsert: StorageDTO.Insert[] = [];
        for (const stream of streams) {
            for (let i = 0; i < 3; i++) {
                storagesToInsert.push({
                    streamId: stream.id,
                    fileUrl: `https://example.com/${stream.id}`,
                    fileType: "video",
                    startTime: new Date(),
                    endTime: addHours(new Date(), i + 1), // 1 hour later
                    fileName: `video_${i}.mp4`,
                    status: "processing",
                });
            }
        }

        const storages = await db
            .insert(tableSchemas.storageTable)
            .values(storagesToInsert)
            .returning()
            .onConflictDoNothing();

        // Seeding video
        const videosToInsert: VideoDTO.Insert[] = [];
        for (const s of streams) {
            for (let i = 1; i <= 3; i++) {
                videosToInsert.push({
                    streamId: s.id,
                    title: `Video title ${i} - ${new Date().toISOString()}`,
                    userId: s.userId,
                    videoUrl: "",
                });
            }
        }
        const videos = await db
            .insert(tableSchemas.videoTable)
            .values(videosToInsert)
            .returning()
            .onConflictDoNothing();

        const paymentMethods = ["VNPAY", "MOMO", "ZALOPAY"] as const;
        const statuses = ["COMPLETED", "PENDING", "CANCELLED"] as const;
        const endDate = new Date();
        const startDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth() - 3 + 1,
        );
        const ordersData = [];

        for (let i = 0; i < users.length * 5; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const stream =
                streams[Math.floor(Math.random() * streams.length) % 3];
            const paymentMethod =
                paymentMethods[
                    Math.floor(Math.random() * paymentMethods.length)
                ];
            const status =
                statuses[Math.floor(Math.random() * statuses.length)];
            const totalAmount = Math.floor(Math.random() * 490000) + 10000; // 10,000 đến 500,000 VNĐ
            const createdAt = randomDate(startDate, endDate);

            ordersData.push({
                userId: user.id,
                streamId: stream.id,
                totalAmount,
                status: status as "COMPLETED" | "PENDING" | "CANCELLED",
                message: `Donation ${i + 1}`,
                paymentMethod,
                createdAt,
                updatedAt: createdAt,
                completedAt:
                    status === "COMPLETED"
                        ? randomDate(new Date(createdAt), endDate)
                        : null,
            });
        }
        await db.insert(tableSchemas.orderTable).values(ordersData);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to seed database");
    }
};

seeds()
    .then(() => {
        console.log("Seeding completed");
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })
    .finally(() => {
        process.exit(0);
    });
