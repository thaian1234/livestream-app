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
    await db.delete(tableSchemas.donateCardTable);
    await db.delete(tableSchemas.walletTransactionTable);
    await db.delete(tableSchemas.walletTable);
    await db.delete(tableSchemas.orderTable);
    await db.delete(tableSchemas.streamTable);
    await db.delete(tableSchemas.settingTable);
    await db.delete(tableSchemas.accountTable);
    await db.delete(tableSchemas.userTable);
    await db.delete(tableSchemas.streamsToCategoriesTable);
    await db.delete(tableSchemas.categoryTable);
    await db.delete(tableSchemas.storageTable);
    await db.delete(tableSchemas.videoTable);
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
