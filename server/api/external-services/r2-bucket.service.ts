import { Utils } from "../lib/helpers/utils";
import { R2BucketValidation } from "../lib/validations/schema.validation";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { generateIdFromEntropySize } from "lucia";

import { envServer } from "@/lib/env/env.server";

export interface IR2BucketService
    extends Utils.AutoMappedClass<R2BucketService> {}

export class R2BucketService implements IR2BucketService {
    private s3Client;
    private maxSize = 5 * 1024 ** 2; // 5MB
    constructor() {
        this.s3Client = new S3Client({
            region: "auto",
            endpoint: `https://${envServer.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: envServer.CLOUDFLARE_ACCESS_KEY_ID,
                secretAccessKey: envServer.CLOUDFLARE_SECRET_ACCESS_KEY,
            },
        });
    }
    public async generateSignedUrl(file: R2BucketValidation.UploadFile) {
        if (file.fileSize > this.maxSize) {
            return {
                signedUrl: null,
                imageUrl: null,
            };
        }
        const id = generateIdFromEntropySize(10);
        const key = `${id}/${file.fileName}`;
        const cmd = new PutObjectCommand({
            Bucket: envServer.CLOUDFLARE_BUCKET_NAME,
            Key: key,
            ContentType: file.fileType,
            ContentLength: file.fileSize,
        });
        const signedUrl = await getSignedUrl(this.s3Client, cmd, {
            expiresIn: 3600,
        });
        const imageUrl = `${envServer.CLOUD_FLARE_BUCKET_URL}/${key}`;
        return { signedUrl, imageUrl };
    }
}
