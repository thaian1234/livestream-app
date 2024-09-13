import Database from "..";
import tableSchemas from "../schemas";

const db = Database.getInstance().db;

const resetSeeds = async () => {
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
};

resetSeeds()
    .then(() => {
        console.log("reset successfully");
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(() => {
        process.exit(0);
    });
