import Database from "..";
import tableSchemas from "../schemas";
import { config } from "dotenv";
import { alphabet, generateRandomString } from "oslo/crypto";
import { z } from "zod";

import {
    BlockValidation,
    FollowValidation,
    NotificationValidation,
    StreamValidation,
    UserValidation,
} from "@/server/api/lib/validations/schema.validation";

config({
    path: ".env",
});

const db = Database.getInstance().db;

const seeds = async () => {
    try {
        console.log("Seeding database");

        // Delete all tables
        await db.delete(tableSchemas.sessionTable);
        await db.delete(tableSchemas.followTable);
        await db.delete(tableSchemas.blockTable);
        await db.delete(tableSchemas.notificationTable);
        await db.delete(tableSchemas.streamTable);
        await db.delete(tableSchemas.settingTable);
        await db.delete(tableSchemas.userTable);

        // Seeding user
        let usersData: UserValidation.Insert[] = [];
        for (let i = 0; i <= 50; i++) {
            const password = generateRandomString(8, alphabet("0-9"));
            usersData.push({
                email: `user${i}@test.com`,
                username: `user_${i}`,
                hashedPassword: password,
            });
        }
        const users = await db
            .insert(tableSchemas.userTable)
            .values(usersData)
            .returning();

        // Seeding follow
        let followData: z.infer<typeof FollowValidation.insertSchema>[] = [];
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
        let blockData: z.infer<typeof BlockValidation.insertSchema>[] = [];
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
        let streamData: z.infer<typeof StreamValidation.insertSchema>[] = [];
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

        // Seeding notifications
        let notificationData: z.infer<
            typeof NotificationValidation.insertSchema
        >[] = [];
        for (const stream of streams) {
            for (const user of users) {
                if (user.id !== stream.userId) {
                    if (notificationData.length === 150) break;
                    notificationData.push({
                        userId: user.id,
                        streamId: stream.id,
                        message: `${stream.name} is now live!`,
                        type:
                            Math.random() > 0.5 ? "stream_start" : "stream_end",
                        isRead: Math.random() > 0.5,
                    });
                }
            }
        }
        // Insert all the data
        await db
            .insert(tableSchemas.notificationTable)
            .values(notificationData)
            .onConflictDoNothing();
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
    });
