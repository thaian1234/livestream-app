import Database from "..";
import tableSchemas from "../schemas";
import { z } from "zod";

import { BlockDTO } from "@/server/api/dtos/block.dto";
import { FollowDTO } from "@/server/api/dtos/follow.dto";
import { StreamDTO } from "@/server/api/dtos/stream.dto";
import { UserDTO } from "@/server/api/dtos/user.dto";
import { LuciaService } from "@/server/api/external-services/lucia.service";
import { Utils } from "@/server/api/lib/helpers/utils";

const db = Database.getInstance().db;
const lucia = LuciaService.getInstance();

async function signUpAllUser(users: UserDTO.Select[]) {
    for (const user of users) {
        const password = "123456";
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
