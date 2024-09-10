import { getRequestExecutionContext } from "../helpers/wait-util";
import { createFactory } from "hono/factory";
import type { Session, User } from "lucia";

type ContextVariables = {
    user: User | null;
    session: Session | null;
    getUser: User;
    getSession: Session;
    executionCtx: ReturnType<typeof getRequestExecutionContext>;
};

type Env = {
    Variables: ContextVariables;
};

type CreateFactoryType = ReturnType<typeof createFactory<Env>>;

export type { Env, CreateFactoryType };
