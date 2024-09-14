"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardBody,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import "@/style/auth.css";
import { ChevronLeft } from "lucide-react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from 'next/navigation';
import { ErrorField } from "@/components/error-field";

export default function Page() {
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const [isError, setIsError] = useState(true);
    const handleSubmit = () => {
        //handle
        router.push("/home"); //success case
    }
    return (
        <Card className="justify-between text-base">
            <CardBody>
                <CardContent>
                    <button
                        onClick={() => router.push('/sign-up')}
                    >
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
                    <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                            <InputOTPSlot index={7} />
                        </InputOTPGroup>
                    </InputOTP>
                    {isError && <ErrorField>Wrong OTP, please try again!</ErrorField>}
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
        </Card >
    );
}
