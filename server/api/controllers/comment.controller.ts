import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { BlockUtils } from "../lib/helpers/block-util";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { ICategoryService } from "../services/category.service";
import { ICommentService } from "../services/comment.service";
import { IFollowService } from "../services/follow.service";

import { IGetStreamService } from "../external-services/getstream.service";

import { CommentDTO } from "../dtos/comment.dto";
import { FollowDTO } from "../dtos/follow.dto";
import { QueryDTO } from "../dtos/query.dto";

export interface ICommentController
    extends Utils.PickMethods<CommentController, "setupHandlers"> {}
export class CommentController implements ICommentController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly commentService: ICommentService,
    ) {}
    public setupHandlers() {
        return this.factory
            .createApp()
            .use(AuthMiddleware.isAuthenticated)
            .get("/", ...this.getAllComments())
            .get("/:id", ...this.getCommentById())
            .post("/", ...this.createComment())
            .patch("/:id", ...this.updateComment())
            .delete("/:id", ...this.deleteCommentById());
    }
    private getAllComments() {
        const respSchema = CommentDTO.selectSchema.array();
        return this.factory.createHandlers(async (c) => {
            const comments = await this.commentService.getAllComments();
            return ApiResponse.WriteJSON({
                c,
                data: respSchema.parse(comments),
                status: HttpStatus.OK,
            });
        });
    }
    private createComment() {
        const reqSchema = CommentDTO.insertSchema.omit({
            userId: true,
        });
        const respSchema = CommentDTO.selectSchema;

        return this.factory.createHandlers(
            zValidator("json", reqSchema, Validator.handleParseError),
            async (c) => {
                const jsonData = c.req.valid("json");
                const user = c.get("getUser");
                const comment = await this.commentService.createComment({
                    ...jsonData,
                    userId: user.id,
                });

                return ApiResponse.WriteJSON({
                    c,
                    data: respSchema.parse(comment),
                    status: HttpStatus.Created,
                });
            },
        );
    }
    private getCommentById() {
        const respSchema = CommentDTO.commentWithUser;
        const params = z.object({
            id: z.string().uuid(),
        });

        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const currentUser = c.get("user");
                const params = c.req.valid("param");
                const comment = await this.commentService.getCommentById(
                    params.id,
                );
                if (!comment) {
                    throw new MyError.BadRequestError("Comment not found");
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: respSchema.parse(comment),
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private updateComment() {
        const reqSchema = CommentDTO.updateSchema.omit({
            userId: true,
            id: true,
            videoId: true,
        });
        const respSchema = CommentDTO.selectSchema;
        const params = z.object({
            id: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("json", reqSchema, Validator.handleParseError),
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const jsonData = c.req.valid("json");
                const params = c.req.valid("param");
                const comment = await this.commentService.updateComment(
                    params.id,
                    jsonData,
                );
                if (!comment) {
                    throw new MyError.NotFoundError("Failed to update comment");
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: respSchema.parse(comment),
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private deleteCommentById() {
        const params = z.object({
            id: z.string().uuid(),
        });
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const params = c.req.valid("param");
                const isSuccess = await this.commentService.deleteComment(
                    params.id,
                );
                if (!isSuccess) {
                    throw new MyError.NotFoundError("Comment not found");
                }
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Comment deleted successfully",
                    data: undefined,
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
