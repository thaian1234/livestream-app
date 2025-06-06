import { ResetPasswordForm } from "@/lib/features/auth/components/reset-password-form";

import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
    return (
        <Card className="justify-between text-base">
            <CardBody>
                <CardHeader>
                    <CardTitle>Enter your new password</CardTitle>
                </CardHeader>
                <ResetPasswordForm />
            </CardBody>
        </Card>
    );
}
