import { QueryDTO } from "../dtos/query.dto";
import { StreamDTO } from "../dtos/stream.dto";
import { IGetStreamService } from "../external-services/getstream.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { IStreamService } from "../services/stream.service";
import { zValidator } from "@hono/zod-validator";

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
            .get("/", ...this.getAllStreamHandler());
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
        const queries = QueryDTO.createPaginationSchema(1, 5);
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const { page, size } = c.req.valid("query");
                const currentUser = c.get("user");
                const offset = (page - 1) * size;

                const recommendsPromise = currentUser
                    ? this.streamService.getRecommendedStreamsByUserId(
                          currentUser.id,
                          offset,
                          size,
                      )
                    : this.streamService.getRecommendedStreams(offset, size);
                const followingsPromise = currentUser
                    ? this.streamService.getFollowingStreamsByUserId(
                          currentUser.id,
                          offset,
                          size,
                      )
                    : null;

                const [recommendStreams, followingStreams] = await Promise.all([
                    recommendsPromise,
                    followingsPromise,
                ]);

                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        recommends:
                            StreamDTO.parseStreamWithUser(recommendStreams),
                        followings:
                            StreamDTO.parseStreamWithUser(followingStreams),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
