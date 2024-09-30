import { z } from "zod";

export class GithubDTO {
    private static baseSchema = z.object({
        id: z.number().transform((num) => num.toString()),
        email: z.string().email(),
        name: z.string(),
        avatar_url: z.string().url(),
        verified_email: z.boolean().default(true),
    });
    public static responseSchema = this.baseSchema;
}

export namespace GithubDTO {
    export type Response = z.infer<typeof GithubDTO.responseSchema>;
}
