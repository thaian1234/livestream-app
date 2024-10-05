import {
    IUploadController,
    UploadController,
} from "../controllers/upload.controller";
import { R2BucketService } from "../external-services/r2-bucket.service";
import { CreateFactoryType } from "../lib/types/factory.type";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { StreamRepository } from "../repositories/stream.repository";
import { UserRepository } from "../repositories/user.repository";
import { StreamService } from "../services/stream.service";
import { UserService } from "../services/user.service";
import { createFactory } from "hono/factory";

class UploadRoutes {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly uploadController: IUploadController,
    ) {}
    setupRoutes() {
        return this.factory
            .createApp()
            .basePath("/upload")
            .route("/", this.uploadController.setupHandlers());
    }
}

function uploadContainer(): UploadRoutes {
    const factory = createFactory();
    // Repository
    const userRepository = new UserRepository();
    const streamRepository = new StreamRepository();
    // Service
    const r2BucketService = new R2BucketService();
    const userService = new UserService(userRepository);
    const streamService = new StreamService(streamRepository);
    // Controller
    const uploadController = new UploadController(
        factory,
        r2BucketService,
        userService,
        streamService,
    );
    return new UploadRoutes(factory, uploadController);
}

export const uploadRoutes = uploadContainer().setupRoutes();
