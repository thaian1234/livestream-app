import { z } from "zod";

export class R2BucketDTO {
    private static allowedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
    ] as const;
    public static uploadFileSchema = z.object({
        fileName: z.string().min(1),
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
