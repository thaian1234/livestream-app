import {
    accountRelations,
    accountTable,
    providerNameEnum,
} from "./account.table";
import { blockRelations, blockTable } from "./block.table";
import { categoryRelations, categoryTable } from "./category.table";
import { commentRelations, commentTable } from "./comment.table";
import {
    emailVerificationRelations,
    emailVerificationTable,
} from "./email-verification.table";
import { eventRelations, eventTable } from "./event.table";
import { followRelations, followTable } from "./follow.table";
import { forgetPasswordTable } from "./forget-password.table";
import { notificationTable, typeEnum } from "./notification.table";
import { sessionRelations, sessionTable } from "./session.table";
import { settingRelations, settingTable } from "./setting.table";
import {
    storageRelations,
    storageStatusEnum,
    storageTable,
} from "./storage.table";
import {
    streamsToCategoriesRelations,
    streamsToCategoriesTable,
} from "./stream-category.table";
import { streamRelations, streamTable } from "./stream.table";
import { userRelations, userTable } from "./user.table";
import {
    videosToCategoriesRelations,
    videosToCategoriesTable,
} from "./video-category.table";
import { videoLikeRelations, videoLikeTable } from "./video-like.table";
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
    videosToCategoriesTable,
    eventTable,
    videoLikeTable,
    commentTable,
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
    storageRelations,
    videosToCategoriesRelations,
    eventRelations,
    videoLikeRelations,
    commentRelations,
} as const;

export default tableSchemas;
