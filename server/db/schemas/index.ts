import {
    accountRelations,
    accountTable,
    providerNameEnum,
} from "./account.table";
import { blockRelations, blockTable } from "./block.table";
import { categoryRelations, categoryTable } from "./category.table";
import {
    emailVerificationRelations,
    emailVerificationTable,
} from "./email-verification.table";
import { followRelations, followTable } from "./follow.table";
import { forgetPasswordTable } from "./forget-password.table";
import { notificationTable, typeEnum } from "./notification.table";
import { sessionRelations, sessionTable } from "./session.table";
import { settingRelations, settingTable } from "./setting.table";
import { storageStatusEnum, storageTable } from "./storage.table";
import {
    streamsToCategoriesRelations,
    streamsToCategoriesTable,
} from "./stream-category.table";
import { streamRelations, streamTable } from "./stream.table";
import { userRelations, userTable } from "./user.table";
import {
    videoRelations,
    videoStatusEnum,
    videoTable,
    videoVisibilityEnum,
} from "./video.table";

const tableSchemas = {
    userTable,
    sessionTable,
    blockTable,
    followTable,
    streamTable,
    settingTable,
    notificationTable,
    emailVerificationTable,
    accountTable,
    categoryTable,
    streamsToCategoriesTable,
    forgetPasswordTable,
    videoTable,
    storageTable,
} as const;

export const tableRelations = {
    userRelations,
    blockRelations,
    followRelations,
    sessionRelations,
    settingRelations,
    emailVerificationRelations,
    streamRelations,
    accountRelations,
    typeEnum,
    providerNameEnum,
    streamsToCategoriesRelations,
    categoryRelations,
    forgetPasswordTable,
    videoRelations,
    videoStatusEnum,
    videoVisibilityEnum,
    storageStatusEnum,
} as const;

export default tableSchemas;
