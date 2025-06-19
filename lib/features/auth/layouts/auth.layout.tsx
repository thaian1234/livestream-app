import "@/style/auth.css";
import Link from "next/link";
import React from "react";

import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { OauthButton } from "../components/oauth-buttons";

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
              title: "Already Registered?",
              to: "/sign-in",
              text: "Sign In",
          }
        : {
              title: "Don't have an account?",
              to: "/sign-up",
              text: "Sign Up",
          };

    return (
        <Card className="min-w-[400px] justify-between text-base">
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
            <CardFooter className="items-center pt-2">
                <CardTitle className="text-base font-normal">
                    <span className="mr-2">{footerLink.title}</span>
                    <Link href={footerLink.to} className="hover:underline">
                        {footerLink.text}
                    </Link>
                </CardTitle>
            </CardFooter>
        </Card>
    );
}
