import { Utils } from "../lib/helpers/utils";
import { Env } from "../lib/types/factory.type";
import { Hono } from "hono";
import { Schema } from "zod";

export interface IController {
    setupHandlers(): unknown;
}
