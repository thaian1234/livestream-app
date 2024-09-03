import { App } from "./app/app";

const appInstance = new App();
const app = appInstance.getApp();
const routes = appInstance.setupRoutes();

type AppType = typeof routes;
export { type AppType };
export default app;
