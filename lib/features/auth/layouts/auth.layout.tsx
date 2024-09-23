import { OauthButton } from "../components/oauth.layout";
import Link from "next/link";
import React from "react";

import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import "@/style/auth.css";

interface AuthLayoutProps {
    title: string;
    subTitle?: string;
    isSignUp?: boolean;
    children?: React.ReactNode;
}

export function AuthLayout({
    children,
    title,
    isSignUp,
    subTitle,
}: AuthLayoutProps) {
    const footerLink = isSignUp
        ? {
              title: "Don't have an account?",
              to: "/sign-in",
              text: "Sign In",
          }
        : {
              title: "Already Registered?",
              to: "/sign-up",
              text: "Sign Up",
          };

    return (
        <Card className="justify-between text-base">
            <CardBody>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {subTitle && (
                        <CardTitle className="text-base font-normal">
                            {subTitle}
                        </CardTitle>
                    )}
                </CardHeader>
                {children}
                <OauthButton />
            </CardBody>
            <CardFooter className="items-center">
                <CardTitle className="text-base font-normal">
                    <p className="mr-2">{footerLink.title}</p>
                    <Link href={footerLink.to} className="hover:underline">
                        {footerLink.text}
                    </Link>
                </CardTitle>
            </CardFooter>
        </Card>
    );
}
