// import { blockRelations, blockTable } from "./schemas/block.table";
// import { followRelations, followTable } from "./schemas/follow.table";
// import { sessionRelations, sessionTable } from "./schemas/session.table";
// import { streamRelations, streamTable } from "./schemas/stream.table";
// import { userRelations, userTable } from "./schemas/user.table";
import { blockRelations, blockTable } from "./block.table";
import { followRelations, followTable } from "./follow.table";
import { sessionRelations, sessionTable } from "./session.table";
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
};

export default tableSchemas;
