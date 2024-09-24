import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { OtpForm } from "@/lib/features/auth/components/otp-form";

import {
    Card,
    CardBody,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function OtpVerifyPage() {
    return (
        <Card className="justify-between text-base">
            <CardBody>
                <CardContent>
                    <Link href={"/sign-up"}>
                        <ChevronLeft />
                    </Link>
                </CardContent>
                <CardHeader>
                    <CardTitle>OTP verification</CardTitle>
                    <CardTitle className="text-base font-normal">
                        Enter the OTP you received to your email
                    </CardTitle>
                </CardHeader>
                <OtpForm />
            </CardBody>
        </Card>
    );
}
