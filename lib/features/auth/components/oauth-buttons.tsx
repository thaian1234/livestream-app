import { FaFacebook, FaGithub } from "react-icons/fa";

import { CardContent } from "@/components/ui/card";

import { GithubButton } from "./github-button";
import { GoogleButton } from "./google-button";

export function OauthButton() {
    return (
        <CardContent className="items-center">
            <div className="flex w-full items-center">
                <div className="h-0.5 grow bg-gray-1"></div>
                <span className="px-4 font-sans text-gray-1"> Or </span>
                <div className="h-0.5 grow bg-gray-1"></div>
            </div>
            <div className="flex space-x-4">
                <GoogleButton />
                <GithubButton />
            </div>
        </CardContent>
    );
}
