import Link from "next/link";

import { IconLogin } from "@/lib/cores/auth/icon-login";

import {
    Card,
    CardBody,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface AuthContainerProps {
    isSignUp?: boolean;
    children?: React.ReactNode;
}
export function AuthContainer({ isSignUp, children }: AuthContainerProps) {
    const description = isSignUp
        ? {
              title: "Signup",
              subtitle: "Just some details to get you in.!",
              text: "Already Registered?",
              link: "/sign-in",
              to: "Login",
          }
        : {
              title: "Login",
              subtitle: "Glad you’re back.!",
              text: "Don&apos;t have an account?",
              link: "/sign-up",
              to: "Signup",
          };
    return (
        <Card className="justify-between text-base">
            <CardBody>
                <CardHeader>
                    <CardTitle>{description.title}</CardTitle>
                    <CardTitle className="text-base font-normal">
                        {description.subtitle}
                    </CardTitle>
                </CardHeader>
                {children}
                <IconLogin></IconLogin>
            </CardBody>
            <CardFooter className="items-center">
                <CardTitle className="text-base font-normal">
                    {description.text}
                    <Link href={description.link} className="hover:underline">
                        {" "}
                        {description.to}
                    </Link>
                </CardTitle>
            </CardFooter>
        </Card>
    );
}
