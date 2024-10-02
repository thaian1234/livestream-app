import { UserDTO } from "../dtos/user.dto";
import { Utils } from "../lib/helpers/utils";
import { StreamClient, UserRequest } from "@stream-io/node-sdk";
import { generateIdFromEntropySize } from "lucia";

import { envClient } from "@/lib/env/env.client";
import { envServer } from "@/lib/env/env.server";

export interface IGetStreamService
    extends Utils.AutoMappedClass<GetStreamService> {}
export class GetStreamService implements IGetStreamService {
    private readonly streamClient: StreamClient;
    private callType;
    constructor() {
        this.streamClient = new StreamClient(
            envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
            envServer.GETSTREAM_PRIVATE_API_KEY,
        );
        this.callType = {
            default: "default",
            audio_room: "audio_room",
            livestream: "livestream",
            development: "development",
        } as const;
    }
    public generateUserToken(userId: string) {
        const expirationTime = Math.floor(Date.now() / 1000) + 3600;
        const issuedAt = Math.floor(Date.now() / 1000) - 60;
        const token = this.streamClient.generateUserToken({
            user_id: userId,
            exp: expirationTime,
            iat: issuedAt,
        });
        return token;
    }
    public convertUserToUserRequest(user: UserDTO.Select): UserRequest {
        const imageUrl = user.imageUrl !== null ? user.imageUrl : undefined;
        return {
            id: user.id,
            image: imageUrl,
            name: user.username,
            role: "admin",
        };
    }
    public async upsertUser(user: UserRequest) {
        const newUser = await this.streamClient.upsertUsers([user]);
        return newUser;
    }
    public async createLivestreamRoom(user: UserRequest) {
        const callId = generateIdFromEntropySize(10);
        const call = this.streamClient.video.call(
            this.callType.livestream,
            callId,
        );
        return call.getOrCreate({
            data: {
                created_by: user,
            },
        });
    }
    public async upsertLivestreamRoom(user: UserRequest) {
        const callId = generateIdFromEntropySize(10);
        const call = this.streamClient.video.call(
            this.callType.livestream,
            callId,
        );
        return await call.getOrCreate({
            data: {
                created_by: user,
            },
        });
    }
}
