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
    userRelations,
    sessionTable,
    blockRelations,
    blockTable,
    followTable,
    followRelations,
    streamTable,
    streamRelations,
    sessionRelations,
    settingTable,
    settingRelations,
    notificationTable,
    typeEnum,
    emailVerificationRelations,
    emailVerificationTable,
};

export default tableSchemas;
