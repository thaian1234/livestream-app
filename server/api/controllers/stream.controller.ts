import { QueryDTO } from "../dtos/query.dto";
import { StreamDTO } from "../dtos/stream.dto";
import { IGetStreamService } from "../external-services/getstream.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import PaginationHelper from "../lib/helpers/pagination";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { IStreamService } from "../services/stream.service";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export interface IStreamController
    extends Utils.AutoMappedClass<StreamController> {}

export class StreamController implements IStreamController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly streamService: IStreamService,
        private readonly getStreamService: IGetStreamService,
    ) {}
    setupHandlers() {
        return this.factory
            .createApp()
            .get("/stream-token", ...this.getStreamTokenHandler())
            .patch("/", ...this.updateStreamHandler())
            .get("/", ...this.getAllStreamHandler())
            .get("/chat-token", ...this.getStreamChatTokenHandler());
    }
    private getStreamTokenHandler() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const stream = await this.streamService.getStreamWithSetting(
                    currentUser.id,
                );
                const token = this.getStreamService.generateUserToken(
                    currentUser.id,
                );
                if (!stream || !stream.setting) {
                    return ApiResponse.WriteJSON({
                        c,
                        msg: "Get token successfully",
                        data: {
                            token: token,
                        },
                        status: HttpStatus.Created,
                    });
                }
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Get token successfully",
                    status: HttpStatus.Created,
                    data: {
                        token:
                            stream.setting.streamKey !== null
                                ? stream.setting.streamKey
                                : token,
                    },
                });
            },
        );
    }
    private updateStreamHandler() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                StreamDTO.updateSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const jsonData = c.req.valid("json");
                if (!currentUser) {
                    throw new MyError.UnauthorizedError();
                }
                const updatedStream = await this.streamService.updateStream(
                    currentUser.stream.id,
                    jsonData,
                );
                if (!updatedStream) {
                    throw new MyError.BadRequestError("Stream updates fail");
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: StreamDTO.parse(updatedStream),
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getAllStreamHandler() {
        const queries = z.object({
            recommendPage: QueryDTO.createQueryParam(10),
            recommendSize: QueryDTO.createQueryParam(5),
            followPage: QueryDTO.createQueryParam(10),
            followSize: QueryDTO.createQueryParam(5),
        });

        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const { recommendSize, followSize, recommendPage, followPage } =
                    c.req.valid("query");
                const currentUser = c.get("user");
                const recommendOffset = (recommendPage - 1) * recommendSize;
                const followOffset = (followPage - 1) * followSize;

                const recommendsPromise = currentUser
                    ? this.streamService.getRecommendedStreamsByUserId(
                          currentUser.id,
                          recommendOffset,
                          recommendSize,
                      )
                    : this.streamService.getRecommendedStreams(
                          recommendOffset,
                          recommendSize,
                      );

                const followingsPromise = currentUser
                    ? this.streamService.getFollowingStreamsByUserId(
                          currentUser.id,
                          followOffset,
                          followSize,
                      )
                    : null;
                const [recommendStreams, followingStreams] = await Promise.all([
                    recommendsPromise,
                    followingsPromise,
                ]);

                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        recommends: PaginationHelper.getPaginationMetadata({
                            data: StreamDTO.parseStreamWithUser(
                                recommendStreams?.streams,
                            ),
                            totalRecords: recommendStreams?.totalRecords,
                            currentOffset: recommendOffset,
                            limit: recommendSize,
                        }),
                        followings: PaginationHelper.getPaginationMetadata({
                            data: StreamDTO.parseStreamWithUser(
                                followingStreams?.streams,
                            ),
                            totalRecords: followingStreams?.totalRecords,
                            currentOffset: followOffset,
                            limit: followSize,
                        }),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getStreamChatTokenHandler() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const token = this.getStreamService.generateStreamChatToken(
                    currentUser.id,
                );
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Get token successfully",
                    data: {
                        token: token,
                    },
                    status: HttpStatus.Created,
                });
            },
        );
    }
}
