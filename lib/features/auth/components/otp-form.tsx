"use client";

import "@/style/auth.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";

import { EmailVerificationDTO } from "@/server/api/dtos/email-verification.dto";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import { ErrorField } from "@/components/error-field";

import { authApi } from "../apis";

export function OtpForm() {
    const userId = authApi.query.useGetUserId();
    const { mutate: sendEmailVerifyCodeHandler, isPending } =
        authApi.mutation.useSendEmailVerifyCode();
    const {
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<EmailVerificationDTO.VerifyEmail>({
        resolver: zodResolver(EmailVerificationDTO.verifyEmailSchema),
        defaultValues: {
            code: "",
            userId: userId,
        },
    });
    const onSubmit = handleSubmit((data) => {
        sendEmailVerifyCodeHandler({
            json: data,
        });
    });
    return (
        <form onSubmit={onSubmit}>
            <CardContent>
                <InputOTP
                    maxLength={8}
                    pattern={REGEXP_ONLY_DIGITS}
                    onChange={(value) => setValue("code", value)}
                >
                    <InputOTPGroup>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <InputOTPSlot index={i} key={i} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
                <div className="flex flex-col">
                    {errors.code && (
                        <ErrorField>{errors.code.message}</ErrorField>
                    )}
                    {errors.userId && (
                        <ErrorField>
                            Please sign up before enter this page
                        </ErrorField>
                    )}
                </div>
            </CardContent>
            <Button className="mt-6 w-full" variant="gradient" type="submit">
                Send
            </Button>
        </form>
    );
}
