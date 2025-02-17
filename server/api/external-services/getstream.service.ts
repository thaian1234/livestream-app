import { StreamClient, UserRequest } from "@stream-io/node-sdk";
import { StreamChat } from "stream-chat";

import { envClient } from "@/lib/env/env.client";
import { envServer } from "@/lib/env/env.server";

import { Utils } from "../lib/helpers/utils";

import { StreamDTO } from "../dtos/stream.dto";
import { UserDTO } from "../dtos/user.dto";

export interface IGetStreamService
    extends Utils.AutoMappedClass<GetStreamService> {}
export class GetStreamService implements IGetStreamService {
    private readonly streamClient: StreamClient;
    private readonly streamChatClient: StreamChat;
    private readonly callType;
    private readonly roles;
    constructor() {
        this.streamClient = new StreamClient(
            envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
            envServer.GETSTREAM_PRIVATE_API_KEY,
            {
                timeout: 10000,
            },
        );
        this.streamChatClient = StreamChat.getInstance(
            envClient.NEXT_PUBLIC_GETSTREAM_API_KEY,
            envServer.GETSTREAM_PRIVATE_API_KEY,
        );
        this.callType = {
            default: "default",
            audio_room: "audio_room",
            livestream: "livestream",
            development: "development",
        } as const;
        this.roles = {
            user: "user",
            moderator: "moderator",
            host: "host",
            admin: "admin",
            call_member: "call-member",
        } as const;
    }
    public generateUserToken(userId: string) {
        const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 1 week
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
        };
    }
    public convertStreamToUserRequest(stream: StreamDTO.Select): UserRequest {
        const imageUrl =
            stream.thumbnailUrl !== null ? stream.thumbnailUrl : undefined;
        return {
            id: stream.id,
            name: stream.name,
            image: imageUrl,
            role: this.roles.user,
        };
    }
    public async upsertUser(user: UserDTO.Select) {
        const convertedUser = this.convertUserToUserRequest(user);
        const newUser = await this.streamClient.upsertUsers([convertedUser]);
        return newUser;
    }
    public async upsertLivestreamRoom(user: UserDTO.Select, streamId: string) {
        const convertedUser = this.convertUserToUserRequest(user);
        const callId = streamId;
        const call = this.streamClient.video.call(
            this.callType.livestream,
            callId,
        );
        const callRoom = await call.getOrCreate({
            data: {
                created_by: convertedUser,
                members: [
                    {
                        user_id: convertedUser.id,
                        role: this.roles.host,
                    },
                ],
            },
        });
        return callRoom;
    }

    public async createChatChannel(userId: string, streamId: string) {
        const channel = this.streamChatClient.channel(
            this.callType.livestream,
            streamId,
            {
                created_by_id: userId,
            },
        );
        await channel.create();
    }

    public generateStreamChatToken(userId: string) {
        const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 1 week
        const issuedAt = Math.floor(Date.now() / 1000) - 60;
        const token = this.streamChatClient.createToken(
            userId,
            expirationTime,
            issuedAt,
        );
        return token;
    }

    public async getRecordings(id: string) {
        const recording = await this.streamClient.video.listRecordings({
            id: id,
            type: this.callType.livestream,
        });
        return recording;
    }

    public verifyWebhook(body: string | Buffer, signature: string) {
        const isValid = this.streamClient.verifyWebhook(body, signature);
        return isValid;
    }
}
