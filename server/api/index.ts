import { Hono } from "hono";

import { App } from "./app/app";

const honoApp = new Hono();
const routes = new App(honoApp).setupRoutes();

type AppType = typeof routes;
export { type AppType };
export default honoApp;
