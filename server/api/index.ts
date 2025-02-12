import { Hono } from "hono";

import Database from "../db";
import { App } from "./app/app";

const db = new Database();
const honoApp = new Hono();

const app = new App(honoApp, db);
const routes = app.setupRoutes();

type AppType = typeof routes;
export { type AppType };
export default honoApp;
