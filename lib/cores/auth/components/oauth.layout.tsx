import { FaFacebook, FaGithub } from "react-icons/fa";

import { CardContent } from "@/components/ui/card";

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
                <button>
                    <FaFacebook size={35} />
                </button>
                <GoogleButton />
                <button>
                    <FaGithub size={35} />
                </button>
            </div>
        </CardContent>
    );
}
