import { z } from "zod";

export class R2BucketDTO {
    private static allowedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/ogg",
    ] as const;

    public static uploadFileSchema = z.object({
        fileName: z
            .string()
            .min(1)
            .transform((name) => {
                // Remove special characters and spaces
                const sanitized = name
                    .toLowerCase()
                    .replace(/[^a-z0-9.]/g, "-")
                    .replace(/-+/g, "-");

                // Add timestamp to ensure uniqueness
                const timestamp = Date.now();
                const extension = sanitized.split(".").pop();
                const baseName = sanitized.split(".").slice(0, -1).join(".");

                return `${baseName}-${timestamp}.${extension}`;
            }),
        fileSize: z.coerce.number(),
        fileType: z
            .string()
            .refine((type) => this.allowedFileTypes.includes(type as any), {
                message:
                    "Invalid file type. Allowed types are: jpeg, png, gif, webp",
            }),
    });
}
export namespace R2BucketDTO {
    export type UploadFile = z.infer<typeof R2BucketDTO.uploadFileSchema>;
}
