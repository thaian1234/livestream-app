import { z } from "zod";

export class GoogleDTO {
    private static baseSchema = z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        picture: z.string().url(),
        verified_email: z.boolean().default(false),
    });
    public static responseSchema = this.baseSchema;
}

export namespace GoogleDTO {
    export type Response = z.infer<typeof GoogleDTO.responseSchema>;
}
