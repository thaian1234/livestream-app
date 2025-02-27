import { Hono } from "hono";

import { App } from "./app/app";

const honoApp = new Hono();
const routes = new App(honoApp);

type AppType = ReturnType<App["setupRoutes"]>;

export { type AppType };
export default honoApp;
