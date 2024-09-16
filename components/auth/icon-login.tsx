import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";

import { CardContent } from "@/components/ui/card";

export function IconLogin() {
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
                <button>
                    <FaGithub size={35} />
                </button>
                <button>
                    <FaGoogle size={35} />
                </button>
            </div>
        </CardContent>
    );
}
