"use client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ErrorField } from "@/components/error-field";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardBody,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

export function OtpVerify() {
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const [isError, setIsError] = useState(true);
    const handleSubmit = () => {
        //handle
        router.push("/home"); //success case
    };
    return (
        <Card className="text-base">
            <CardBody>
                <CardContent>
                    <button onClick={() => router.push("/sign-up")}>
                        <ChevronLeft />
                    </button>
                </CardContent>
                <CardHeader>
                    <CardTitle>OTP verification</CardTitle>
                    <CardTitle className="text-base font-normal">
                        Enter the OTP you received to your email
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <InputOTP
                        maxLength={8}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                    >
                        <InputOTPGroup>
                            {Array.from({ length: 8 }).map(
                                (_: unknown, i: number) => (
                                    <InputOTPSlot index={i} key={i} />
                                ),
                            )}
                        </InputOTPGroup>
                    </InputOTP>
                    {isError && (
                        <ErrorField>Wrong OTP, please try again!</ErrorField>
                    )}
                </CardContent>
                <Button
                    className="mt-6"
                    variant="gradient"
                    disabled={otp.length !== 8}
                    onClick={handleSubmit}
                >
                    Next
                </Button>
            </CardBody>
        </Card>
    );
}
