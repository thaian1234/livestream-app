import { Hono } from "hono";

import { App } from "./app/app";

const honoApp = new Hono();
const routes = new App(honoApp);

export default honoApp;
