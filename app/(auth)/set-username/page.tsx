import { SetUsernameForm } from "@/lib/features/auth/components/set-username-form";

import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";

export default function OtpVerifyPage() {
    return (
        <Card className="justify-between text-base">
            <CardBody>
                <CardHeader>
                    <CardTitle>Set user name</CardTitle>
                    <CardTitle className="text-base font-normal">
                        What do you want to be called?
                    </CardTitle>
                </CardHeader>
                <SetUsernameForm />
            </CardBody>
        </Card>
    );
}
