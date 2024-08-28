import { createFactory } from "hono/factory";
import type { Session, User } from "lucia";

type ContextVariables = {
    user: User | null;
    session: Session | null;
    getUser: User;
    getSession: Session;
};

type Env = {
    Variables: ContextVariables;
};

type CreateFactoryType = ReturnType<typeof createFactory<Env>>;

export type { Env, CreateFactoryType };
