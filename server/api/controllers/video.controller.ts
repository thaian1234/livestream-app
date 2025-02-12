import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";

import { IVideoService } from "../services/video.service";

import { VideoDTO } from "../dtos/video.dto";

export interface IVideoController
    extends Utils.PickMethods<VideoController, "setupHandlers"> {}
export class VideoController {
    constructor(
        private factory: CreateFactoryType,
        private videoSerivce: IVideoService,
    ) {}
    public setupHandlers() {
        return this.factory.createApp().get("/", ...this.getAllVideos());
    }
    private getAllVideos() {
        const respSchema = VideoDTO.selectSchema.array();
        return this.factory.createHandlers(async (c) => {
            const videos = await this.videoSerivce.getAllVideos();
            return ApiResponse.WriteJSON({
                c,
                data: respSchema.parse(videos),
                status: HttpStatus.OK,
            });
        });
    }
}
