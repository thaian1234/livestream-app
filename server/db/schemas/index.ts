import {
    accountRelations,
    accountTable,
    providerNameEnum,
} from "./account.table";
import { blockRelations, blockTable } from "./block.table";
import {
    emailVerificationRelations,
    emailVerificationTable,
} from "./email-verification.table";
import { followRelations, followTable } from "./follow.table";
import { notificationTable, typeEnum } from "./notification.table";
import { sessionRelations, sessionTable } from "./session.table";
import { settingRelations, settingTable } from "./setting.table";
import { streamRelations, streamTable } from "./stream.table";
import { userRelations, userTable } from "./user.table";

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
} as const;

export default tableSchemas;
