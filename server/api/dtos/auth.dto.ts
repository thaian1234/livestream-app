import { z } from "zod";

import { UserDTO } from "./user.dto";

const passwordValidation = {
    noSpaces: /(?!.*\s)/,
    validLength: /[a-zA-Z0-9@$!%*?&]{6,16}$/,
    hasNumber: /(?=.*[0-9])/,
    hasLowerCase: /(?=.*[a-z])/,
    hasUpperCase: /(?=.*[A-Z])/,
    hasSpecialChar: /(?=.*[@$!%*?&])/,
};

export class AuthDTO {
    public static passwordSchema = z
        .string()
        .regex(passwordValidation.noSpaces, "No spaces allowed")
        .regex(passwordValidation.validLength, "Must be 6-16 characters long")
        .regex(passwordValidation.hasNumber, "At least 1 number (1-9)")
        .regex(passwordValidation.hasLowerCase, "At least 1 lowercase letter")
        .regex(passwordValidation.hasUpperCase, "At least 1 uppercase letter")
        .regex(
            passwordValidation.hasSpecialChar,
            "At least 1 special character (@$!%*?&)",
        );
    private static baseSchema = UserDTO.insertSchema
        .pick({
            username: true,
            email: true,
        })
        .extend({
            password: this.passwordSchema,
            confirmPassword: this.passwordSchema,
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
            password: this.passwordSchema,
            confirmPassword: this.passwordSchema,
        })
        .refine((data) => data.password === data.confirmPassword, {
            path: ["confirmPassword"],
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
