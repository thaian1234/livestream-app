import { UserDTO } from "../../dtos/user.dto";
import { getRequestExecutionContext } from "../helpers/wait-util";
import { createFactory } from "hono/factory";
import type { Session } from "lucia";

type ContextVariables = {
    user: UserDTO.UserWithAccounts | null;
    session: Session | null;
    getUser: UserDTO.UserWithAccounts;
    getSession: Session;
    executionCtx: ReturnType<typeof getRequestExecutionContext>;
};

type Env = {
    Variables: ContextVariables;
};

type CreateFactoryType = ReturnType<typeof createFactory<Env>>;

export type { Env, CreateFactoryType };
