import { UserValidation } from "../validations/schema.validation";
import { getRequestExecutionContext } from "../helpers/wait-util";
import { createFactory } from "hono/factory";
import type { Session } from "lucia";

type ContextVariables = {
    user: UserValidation.Select | null;
    session: Session | null;
    getUser: UserValidation.Select;
    getSession: Session;
    executionCtx: ReturnType<typeof getRequestExecutionContext>;
};

type Env = {
    Variables: ContextVariables;
};

type CreateFactoryType = ReturnType<typeof createFactory<Env>>;

export type { Env, CreateFactoryType };
