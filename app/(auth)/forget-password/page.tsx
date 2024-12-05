import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgetPasswordForm } from "@/lib/features/auth/components/forget-password-form";

export default function ForgetPasswordPage() {
    return (
        <Card className="justify-between text-base">
            <CardBody>
                <CardHeader>
                    <CardTitle>Input your Email</CardTitle>
                    <CardTitle className="text-base font-normal">
                        Account you want to reset password ?
                    </CardTitle>
                </CardHeader>
                <ForgetPasswordForm />
            </CardBody>
        </Card>
    );
}
