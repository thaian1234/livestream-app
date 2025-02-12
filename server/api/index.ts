import { Hono } from "hono";

import { App } from "./app/app";

const honoApp = new Hono();

const app = new App(honoApp);
const routes = app.setupRoutes();

type AppType = typeof routes;
export { type AppType };
export default honoApp;
