import { CreateFactoryType } from "../lib/types/factory.type";

import { ICommentController } from "../controllers/comment.controller";

export class CommentRoutes {
    constructor(
        private factory: CreateFactoryType,
        private commentController: ICommentController,
    ) {}
    public setupRoutes() {
        return this.factory
            .createApp()
            .route("/comments", this.commentController.setupHandlers());
    }
}
