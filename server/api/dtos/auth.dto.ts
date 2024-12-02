import { z } from "zod";

import { UserDTO } from "./user.dto";

export class AuthDTO {
    private static baseSchema = UserDTO.insertSchema
        .pick({
            username: true,
            email: true,
        })
        .extend({
            password: z
                .string()
                .min(6, "Password must be at least 6 characters long")
                .max(255, "Password must not be more than 255 characters long"),
            confirmPassword: z
                .string()
                .min(6, "Password must be at least 6 characters long"),
        });
    public static signinSchema = this.baseSchema.omit({
        username: true,
        confirmPassword: true,
    });
    public static signupSchema = this.baseSchema.refine(
        (data) => data.password === data.confirmPassword,
        {
            path: ["confirmPassword"], // Đây là trường bị lỗi khi validation không thành công
            message: "Passwords must match",
        },
    );
    public static usernameSchema = this.baseSchema.pick({
        username: true,
    });
    public static resetPasswordSchema = z
        .object({
            password: z
                .string()
                .min(6, "Password must be at least 6 characters long")
                .max(255, "Password must not be more than 255 characters long"),
            confirmPassword: z
                .string()
                .min(6, "Password must be at least 6 characters long"),
        })
        .refine((data) => data.password === data.confirmPassword, {
            path: ["confirmPassword"], // Đây là trường bị lỗi khi validation không thành công
            message: "Passwords must match",
        });
    public static userForgetPassword = this.baseSchema.pick({
        email: true,
    });
}
export namespace AuthDTO {
    export type Signin = z.infer<typeof AuthDTO.signinSchema>;
    export type Signup = z.infer<typeof AuthDTO.signupSchema>;
    export type Username = z.infer<typeof AuthDTO.usernameSchema>;
    export type Email = z.infer<typeof AuthDTO.userForgetPassword>;
    export type ResetPassword = z.infer<typeof AuthDTO.resetPasswordSchema>;
}
